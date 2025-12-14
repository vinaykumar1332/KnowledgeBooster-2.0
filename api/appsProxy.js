export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  let body = {};

  // ✅ Manual JSON parsing (required in serverless)
  if (req.method === "POST") {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    } catch {
      body = {};
    }
  }

  const script = body.script || req.query?.script;
  const action = body.action || req.query?.action;

  const payload = { ...body };
  delete payload.script;
  delete payload.action;

  const SCRIPT_URLS = {
    AUTH: "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
  };

  const targetUrl = SCRIPT_URLS[script];

  if (!targetUrl) {
    return res.status(400).json({
      ok: false,
      msg: "Invalid script target",
      receivedScript: script,
    });
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...payload }),
    });

    const text = await upstream.text();

    try {
      return res.status(upstream.status).json(JSON.parse(text));
    } catch {
      return res.status(upstream.status).send(text);
    }
  } catch (err) {
    return res.status(500).json({
      ok: false,
      msg: "Proxy error",
      error: String(err),
    });
  }
}
