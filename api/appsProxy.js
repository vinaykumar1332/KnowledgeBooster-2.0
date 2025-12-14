// api/appsProxy.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, msg: "POST only" });
  }

  try {
    const incoming = req.body;

    if (!incoming || typeof incoming !== "object") {
      return res.status(400).json({
        ok: false,
        msg: "Invalid JSON body",
        received: incoming,
      });
    }

    const script = String(incoming.script || "").toUpperCase();
    if (!script) {
      return res.status(400).json({ ok: false, msg: "Missing script" });
    }

    const SCRIPT_URLS = {
      AUTH: "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
      FILES: "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec",
    };

    const targetUrl = SCRIPT_URLS[script];
    if (!targetUrl) {
      return res.status(400).json({ ok: false, msg: "Invalid script" });
    }

    // remove routing key only
    const { script: _, ...payload } = incoming;

    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await upstream.text();

    try {
      return res.status(upstream.status).json(JSON.parse(text));
    } catch {
      return res.status(upstream.status).json({
        ok: false,
        msg: "Upstream returned non-JSON",
        raw: text.slice(0, 500),
      });
    }
  } catch (err) {
    console.error("appsProxy crash:", err);
    return res.status(500).json({
      ok: false,
      error: String(err),
    });
  }
}
