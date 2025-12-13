// api/appsProxy.js
import fetch from "node-fetch"; // REQUIRED for Vercel

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, msg: "Method not allowed" });
    }

    // Ensure body exists
    const body = req.body || {};

    const script = String(body.script || "").toUpperCase();
    const action = body.action || "";

    if (!script) {
      return res.status(400).json({
        ok: false,
        msg: "Missing script key (AUTH / FILES)",
        received: body,
      });
    }

    const SCRIPT_URLS = {
      AUTH: "https://script.google.com/macros/s/AKfycbyPpEMlCPtgy0AMZ8IBEKxwmJs91eh-EQSYuson0d2R9lZUUa1c02ghuK_dUhdJhMLJ/exec",
      FILES: "https://script.google.com/macros/s/AKfycbzXhpMq9Jpn2dtQ57dxjdM9VCQqA7-4a5zc6gxJ8YXEIzGSt_8marYBfibzPs9UA2YD/exec",
    };

    const targetUrl = SCRIPT_URLS[script];
    if (!targetUrl) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid script key",
        script,
      });
    }

    // Remove proxy-only keys
    const upstreamPayload = { ...body };
    delete upstreamPayload.script;

    const upstreamRes = await fetch(targetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(upstreamPayload),
      redirect: "follow",
    });

    const text = await upstreamRes.text();

    // Always respond JSON
    try {
      const json = JSON.parse(text);
      return res.status(upstreamRes.status).json(json);
    } catch {
      return res.status(502).json({
        ok: false,
        msg: "Upstream returned non-JSON",
        upstreamStatus: upstreamRes.status,
        raw: text.slice(0, 3000),
      });
    }
  } catch (err) {
    console.error("appsProxy fatal error:", err);
    return res.status(500).json({
      ok: false,
      msg: "Proxy crashed",
      error: String(err),
    });
  }
}
