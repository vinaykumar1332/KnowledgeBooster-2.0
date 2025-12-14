import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  let body = {};
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
  } catch {}

  const FILES_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec";

  try {
    const upstream = await fetch(FILES_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await upstream.text();

    try {
      return res.status(upstream.status).json(JSON.parse(text));
    } catch {
      return res.status(502).json({
        ok: false,
        msg: "Upstream returned non-JSON",
        raw: text,
      });
    }
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
