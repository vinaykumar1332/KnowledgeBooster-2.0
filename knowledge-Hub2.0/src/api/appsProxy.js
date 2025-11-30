// api/appsProxy.js  (Vercel serverless function)
import fetch from "node-fetch"; // Vercel supports global fetch too; keep import if needed

export default async function handler(req, res) {
  // Allow CORS from anywhere (or set for your domain only)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Replace with your Apps Script URL (or use env var)
  const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL_LOGIN_SIGNUP;

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: req.method === "GET" ? undefined : JSON.stringify(req.body || req),
    });

    const text = await response.text();
    // Try to parse JSON, else send text
    try {
      const json = JSON.parse(text);
      res.status(response.status).json(json);
    } catch (err) {
      res.status(response.status).send(text);
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ ok: false, msg: "Proxy error" });
  }
}
