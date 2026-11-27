/**
 * KnowledgeHub – files backend (Google Apps Script).
 *
 * HOW TO DEPLOY (keeps the same /exec URL, so nothing else needs changing):
 *   1. Open the Apps Script project, replace the code with this file, Save.
 *   2. Deploy > Manage deployments > select the existing deployment > Edit (pencil)
 *   3. Version: "New version" > Deploy.
 *
 * Contract (same as before):
 *   POST { action: "save", username, email, category, subcategory, title, description,
 *          driveUrl, fileId?, thumbnailUrl?, tags? }
 *     -> { ok: true, msg, fileId }
 *     -> { ok: false, error, msg }                          (validation problems)
 *     -> { ok: false, duplicate: true, error, msg, fileId } (file already shared)
 *   POST { action: "list" }
 *     -> { ok: true, rows: [{ timestamp, username, email, ... }] }  (keys = lowercase headers)
 */

const SHEET_ID = "1ppiIhMvgcFYvkoSO3p3TbPlydR5pRaJ8BsYmKY6REr4";
const SHEET_NAME = "files";

const CATEGORIES = ["student", "professional", "others"];

// Column order used only when the sheet has no header row yet
const DEFAULT_COLUMNS = [
  "timestamp", "username", "email", "category", "subcategory",
  "title", "description", "driveurl", "fileid", "thumbnailurl",
];

const LIMITS = {
  username: 80,
  email: 120,
  subcategory: 40,
  title: 100,
  description: 300,
  driveUrl: 500,
  tags: 200,
};

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = {};
      }
    } else if (e && e.parameter) {
      payload = Object.assign({}, e.parameter);
    }

    const action = String(payload.action || "").toLowerCase();
    switch (action) {
      case "save":
        return jsonResponse(saveFile(payload));
      case "list":
        return jsonResponse(listFiles());
      case "":
        return jsonResponse(fail("Missing action"));
      default:
        return jsonResponse(fail("Invalid action", { receivedAction: action }));
    }
  } catch (err) {
    return jsonResponse(fail(String(err)));
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

/** Same message in `error` (older clients) and `msg` (the app shows this). */
function fail(message, extra) {
  return Object.assign({ ok: false, error: message, msg: message }, extra || {});
}

/** First non-empty value among the given keys (accepts camelCase and lowercase names). */
function pick(data, keys) {
  for (let i = 0; i < keys.length; i++) {
    const v = data[keys[i]];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

/**
 * Tidies whitespace, caps length, and stops Sheets from treating the text as a formula
 * (values starting with = + - @ are stored as plain text with a leading apostrophe).
 */
function safeText(value, max) {
  let s = String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}

/** Lowercase header names; creates the header row if the sheet is empty. */
function readHeaders(sheet) {
  if (sheet.getLastColumn() === 0) {
    sheet.getRange(1, 1, 1, DEFAULT_COLUMNS.length).setValues([DEFAULT_COLUMNS]);
    return DEFAULT_COLUMNS.slice();
  }
  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getDisplayValues()[0]
    .map(function (h) { return String(h || "").trim().toLowerCase(); });
}

function saveFile(data) {
  data = data || {};

  const title = safeText(pick(data, ["title"]), LIMITS.title);
  const driveUrl = safeText(pick(data, ["driveUrl", "driveurl"]), LIMITS.driveUrl);
  if (!title || !driveUrl) {
    return fail("Title and Drive URL are required", { received: { title: title, driveUrl: driveUrl } });
  }

  const fileId = pick(data, ["fileId", "fileid"]) || extractDriveFileId(driveUrl);
  if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return fail("Invalid Google Drive URL");
  }

  let category = pick(data, ["category"]).toLowerCase();
  if (CATEGORIES.indexOf(category) === -1) category = "others";

  // Only one upload writes at a time, so the duplicate check and the append can't race
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    if (!sheet) return fail("Sheet not found: " + SHEET_NAME);

    const headers = readHeaders(sheet);

    // Refuse a second copy of the same Drive file
    const fileIdCol = headers.indexOf("fileid");
    if (fileIdCol >= 0 && sheet.getLastRow() > 1) {
      const ids = sheet.getRange(2, fileIdCol + 1, sheet.getLastRow() - 1, 1).getDisplayValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]).trim() === fileId) {
          return fail("This file has already been shared", { duplicate: true, fileId: fileId });
        }
      }
    }

    // Thumbnail (best effort, needs the Drive advanced service; fine without it)
    let thumb = pick(data, ["thumbnailUrl", "thumbnailurl"]);
    try {
      if (!thumb && typeof Drive !== "undefined" && Drive.Files) {
        const meta = Drive.Files.get(fileId, { fields: "thumbnailLink" });
        thumb = (meta && meta.thumbnailLink) || "";
      }
    } catch (err) {
      thumb = "";
    }

    const values = {
      timestamp: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"),
      username: safeText(pick(data, ["username"]), LIMITS.username),
      email: safeText(pick(data, ["email"]), LIMITS.email).toLowerCase(),
      category: category,
      subcategory: safeText(pick(data, ["subcategory"]), LIMITS.subcategory),
      title: title,
      description: safeText(pick(data, ["description"]), LIMITS.description),
      driveurl: driveUrl,
      fileid: fileId,
      thumbnailurl: thumb,
      tags: safeText(pick(data, ["tags"]), LIMITS.tags),
    };

    // Write by header name, so reordering columns or adding new ones (e.g. "tags") never shifts data
    const row = headers.map(function (h) { return values[h] !== undefined ? values[h] : ""; });
    sheet.appendRow(row);

    return { ok: true, msg: "Saved successfully", fileId: fileId };
  } finally {
    lock.releaseLock();
  }
}

function listFiles() {
  const sheet = getSheet();
  if (!sheet) return fail("Sheet not found: " + SHEET_NAME);

  // Display values = exactly what the sheet shows (stable timestamps, no Date objects)
  const data = sheet.getDataRange().getDisplayValues();
  if (data.length <= 1) return { ok: true, rows: [] };

  const headers = data[0].map(function (h) { return String(h || "").trim().toLowerCase(); });

  const rows = [];
  for (let r = 1; r < data.length; r++) {
    const obj = {};
    let hasContent = false;
    for (let c = 0; c < headers.length; c++) {
      if (!headers[c]) continue;
      const v = data[r][c] != null ? String(data[r][c]).trim() : "";
      obj[headers[c]] = v;
      if (v) hasContent = true;
    }
    if (hasContent) rows.push(obj);
  }

  return { ok: true, rows: rows };
}

function extractDriveFileId(url) {
  if (!url) return "";
  const patterns = [/\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/, /open\?id=([a-zA-Z0-9_-]+)/];
  for (let i = 0; i < patterns.length; i++) {
    const m = String(url).match(patterns[i]);
    if (m) return m[1];
  }
  return "";
}
