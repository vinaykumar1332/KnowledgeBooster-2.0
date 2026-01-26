// api/files.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  const FILES_URL = process.env.VITE_FILES_URL || process.env.FILES_URL;
  if (!FILES_URL) return res.status(500).json({ ok: false, msg: "FILES_URL not configured" });

  try {
    let body = {};
    if (req.method === "POST") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    }
    const upstream = await fetch(FILES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await upstream.text();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      parsed = { ok: false, msg: "Upstream returned non-JSON", raw };
    }

    return res.status(upstream.status || 200).json(parsed);
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
