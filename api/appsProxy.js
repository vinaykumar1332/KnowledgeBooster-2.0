// api/appsProxy.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ ok: false, msg: "Method not allowed" });
  }

  // accept script from body or query (useful for GET testing)
  const incoming = req.body || {};
  const script = incoming.script || req.query?.script;
  const action = incoming.action || req.query?.action;
  // other payload fields
  const payload = { ...incoming };
  delete payload.script;
  delete payload.action;

  const SCRIPT_URLS = {
    AUTH: "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
  };

  const targetUrl = SCRIPT_URLS[script];
  if (!targetUrl) {
    console.error("Invalid script key:", script);
    return res.status(400).json({ ok: false, msg: "Invalid script target", script });
  }

  try {
    const opts = {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {})
      },
      redirect: "follow",
    };

    if (req.method === "POST") {
      opts.body = JSON.stringify({ action, ...payload });
    }

    console.log("Proxy ->", targetUrl, "method:", opts.method);

    const upstream = await fetch(targetUrl, opts);
    console.log("Upstream status:", upstream.status, upstream.statusText);

    // mirror upstream status and safe headers
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => {
      const lower = k.toLowerCase();
      if (lower === "transfer-encoding") return;
      res.setHeader(k, v);
    });

    const text = await upstream.text();
    try {
      const json = JSON.parse(text);
      return res.json(json);
    } catch {
      return res.send(text);
    }
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ ok: false, msg: "Proxy error", error: String(err) });
  }
}
