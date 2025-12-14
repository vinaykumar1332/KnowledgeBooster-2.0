export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  let body = {};

  if (req.method === "POST") {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    } catch {}
  }

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      msg: "filesProxy alive",
    });
  }

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
