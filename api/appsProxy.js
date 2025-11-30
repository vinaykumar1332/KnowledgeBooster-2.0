// api/appsProxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, msg: "Method not allowed" });
  }

  const { script, action, ...payload } = req.body || {};

  // Map script key to actual URL
  const SCRIPT_URLS = {
    AUTH: "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
    // Add more scripts here if needed
  };

  const targetUrl = SCRIPT_URLS[script];

  if (!targetUrl) {
    return res.status(400).json({ ok: false, msg: "Invalid script target" });
  }

  try {
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, ...payload }),
    });

    const text = await response.text();
    try {
      const json = JSON.parse(text);
      res.status(response.status).json(json);
    } catch {
      res.status(response.status).send(text);
    }
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ ok: false, msg: "Proxy error" });
  }
}