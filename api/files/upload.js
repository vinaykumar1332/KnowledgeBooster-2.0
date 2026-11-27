// api/files/upload.js
// POST /api/files/upload  saves one file row to the sheet
import { callUpstream, extractDriveId, readBody, setCors } from "../../lib/filesUpstream.js";

export default async function handler(req, res) {
    setCors(res);
    if (req.method === "OPTIONS") return res.status(204).end();
    if (req.method !== "POST") return res.status(405).json({ ok: false, msg: "Method not allowed" });

    try {
        const body = await readBody(req);
        const { title, driveUrl, description = "", category = "student", subcategory = "Notes", username = "", email = "", thumbnailUrl = "" } = body;

        if (!title || !driveUrl) {
            return res.status(400).json({ ok: false, msg: "Title and Drive link are required" });
        }
        const fileId = body.fileId || extractDriveId(driveUrl);
        if (!fileId) {
            return res.status(400).json({ ok: false, msg: "Invalid Google Drive link" });
        }

        const data = await callUpstream({
            action: "save",
            username,
            email,
            category,
            subcategory,
            title,
            description,
            driveUrl,
            fileId,
            thumbnailUrl,
        });
        // Apps Script reports problems in `error`; the UI shows `msg`
        return res.status(data.ok ? 201 : 400).json({ ...data, msg: data.msg || data.error });
    } catch (err) {
        return res.status(502).json({ ok: false, msg: err.message || "Upstream request failed" });
    }
}
