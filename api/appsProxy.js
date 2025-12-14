// api/appsProxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, msg: "POST only" });
  }

  const incoming = req.body || {};
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

  // 🔑 CRITICAL: remove ONLY `script`
  const { script: _removed, ...payload } = incoming;

  // 🚨 DEBUG (temporary – you can remove later)
  console.log("Proxy payload →", JSON.stringify(payload));

  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // MUST include action
    });

    const text = await upstream.text();

    try {
      return res.status(upstream.status).json(JSON.parse(text));
    } catch {
      return res.status(upstream.status).json({
        ok: false,
        msg: "Upstream not JSON",
        raw: text,
      });
    }
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
