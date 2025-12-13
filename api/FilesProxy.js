import fetch from "node-fetch";

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []; // optional whitelist
export default async function handler(req, res) {
  const origin = req.headers.origin || req.headers.referer || "";
  const allowOrigin = ALLOWED_ORIGINS.length ? (ALLOWED_ORIGINS.includes(origin) ? origin : "") : "*";
  if (allowOrigin) res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  else res.setHeader("Access-Control-Allow-Origin", "*"); // fallback (remove in prod if you use whitelist)
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (!["GET", "POST", "OPTIONS"].includes(req.method)) {
    return res.status(405).json({ ok: false, msg: "Method not allowed" });
  }

  // Incoming payload (body parsed by Next.js)
  const incoming = req.body && Object.keys(req.body).length ? req.body : (req.query || {});
  const scriptKey = (incoming.script || req.query?.script || "").toString().trim().toUpperCase();
  const action = incoming.action || req.query?.action || "";

  if (!scriptKey) {
    console.error("Proxy: missing script key");
    return res.status(400).json({ ok: false, msg: "Missing script key (send script: 'FILES')" });
  }

  const SCRIPT_URLS = {
    FILES: "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec"
  };

  const targetUrl = SCRIPT_URLS[scriptKey];
  if (!targetUrl) {
    console.error("Proxy: unknown script key", scriptKey);
    return res.status(400).json({ ok: false, msg: "Invalid script key" });
  }

  try {
    const upstreamPayload = { ...incoming };
    delete upstreamPayload.script;

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upstreamPayload),
      redirect: "follow",
    });

    const upstreamText = await upstreamRes.text();
    res.setHeader("Content-Type", "application/json");
    try {
      const parsed = JSON.parse(upstreamText);
      return res.status(upstreamRes.status).json(parsed);
    } catch {
      return res.status(upstreamRes.status).json({
        ok: upstreamRes.ok,
        proxiedStatus: upstreamRes.status,
        proxiedText: upstreamText.slice(0, 10000),
        note: "Upstream response not JSON"
      });
    }
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ ok: false, msg: "Proxy error", error: String(err) });
  }
}
