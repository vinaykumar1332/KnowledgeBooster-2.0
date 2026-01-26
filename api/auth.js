// api/auth.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  // Try environment variables first, then fall back to hardcoded Google Apps Script URL
  const AUTH_URL = process.env.VITE_AUTH_URL 
    || process.env.AUTH_URL 
    || "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec";
  
  if (!AUTH_URL) return res.status(500).json({ ok: false, msg: "AUTH_URL not configured" });

  try {
    let body = {};
    if (req.method === "POST") {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    }
    const upstream = await fetch(AUTH_URL, {
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
