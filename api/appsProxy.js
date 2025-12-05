// api/appsProxy.js - hardened proxy (drop in & deploy)
export default async function handler(req, res) {
  // Allow CORS from anywhere (adjust for production domain if needed)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ ok: false, msg: "Method not allowed" });
  }

  // Read incoming info (script key may be in body or query)
  const incoming = req.body && Object.keys(req.body).length ? req.body : req.query || {};
  const scriptKey = incoming.script || req.query?.script;
  const action = incoming.action || req.query?.action;
  const payload = { ...incoming };
  delete payload.script;
  delete payload.action;

  // Map of script keys to deployed Apps Script URLs - set as env vars in Vercel
  const SCRIPT_URLS = {
    AUTH:"https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
    FILES: process.env.APPS_SCRIPT_FILES_URL,
    ADMIN: process.env.APPS_SCRIPT_ADMIN_URL,
    // add more if needed
  };

  if (!scriptKey) {
    console.error("Proxy: missing script key in request");
    return res.status(400).json({ ok: false, msg: "Missing script key" });
  }

  const targetUrl = SCRIPT_URLS[scriptKey];
  if (!targetUrl) {
    console.error("Proxy: invalid script key:", scriptKey, "env urls:", {
      AUTH: !!SCRIPT_URLS.AUTH,
      FILES: !!SCRIPT_URLS.FILES,
      ADMIN: !!SCRIPT_URLS.ADMIN,
    });
    return res.status(400).json({ ok: false, msg: "Invalid script key", script: scriptKey });
  }

  try {
    const upstreamBody = req.method === "GET" ? undefined : JSON.stringify({ action, ...payload });

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: upstreamBody,
      redirect: "follow",
    });

    const upstreamText = await upstreamRes.text();

    // Log useful details (Vercel function logs)
    console.log(`[proxy] target=${targetUrl} status=${upstreamRes.status} action=${action} script=${scriptKey}`);
    if (upstreamText && upstreamText.length > 0) {
      console.log("[proxy] upstreamText (truncated 2000 chars):", upstreamText.substring(0, 2000));
    }

    // Always respond JSON to client. If upstream returned JSON, forward it.
    res.setHeader("Content-Type", "application/json");

    try {
      const parsed = JSON.parse(upstreamText);
      // forward upstream status code and JSON body
      return res.status(upstreamRes.status).json(parsed);
    } catch (parseErr) {
      // upstream returned non-JSON (HTML or text). Wrap it safely.
      return res.status(upstreamRes.status).json({
        ok: upstreamRes.ok,
        proxiedStatus: upstreamRes.status,
        proxiedText: upstreamText.slice(0, 10000), // limit size
        note: "Upstream response was not valid JSON; raw content included in proxiedText"
      });
    }
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ ok: false, msg: "Proxy internal error", error: String(err) });
  }
}
