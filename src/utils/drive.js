
export function extractDriveFileId(url) {
  if (!url) return "";

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,   // /file/d/FILE_ID
    /\/d\/([a-zA-Z0-9_-]+)/,         // /d/FILE_ID
    /[?&]id=([a-zA-Z0-9_-]+)/,       // ?id=FILE_ID
    /open\?id=([a-zA-Z0-9_-]+)/      // open?id=FILE_ID
  ];

  for (const pattern of patterns) {
    const match = String(url).match(pattern);
    if (match && match[1]) return match[1];
  }

  return "";
}

export function extractFileId(item) {
  if (!item) return "";

  // Prefer normalized camelCase
  if (item.fileId) return item.fileId;

  // Backend returns lowercase keys
  if (item.fileid) return item.fileid;

  // Fallback: extract from drive URL
  if (item.driveUrl || item.driveurl) {
    const url = item.driveUrl || item.driveurl;
    return extractDriveFileId(url);
  }

  return "";
}

export function buildDrivePreviewUrl(fileId) {
  if (!fileId) return "";
  return `https://drive.google.com/file/d/${fileId}/preview?rm=minimal&embedded=true`;
}

export function buildDriveViewerUrl(fileId) {
  if (!fileId) return "";
  return `https://drive.google.com/file/d/${fileId}/view`;
}
