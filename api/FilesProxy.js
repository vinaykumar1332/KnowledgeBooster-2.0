// api/filesProxy.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, msg: "POST only" });
  }

  const FILES_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec";

  try {
    // Vercel Node 18+ has global fetch
    const upstream = await fetch(FILES_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // MUST contain action
    });

    const text = await upstream.text();

    // Safely parse JSON
    try {
      const json = JSON.parse(text);
      return res.status(upstream.status).json(json);
    } catch {
      return res.status(upstream.status).json({
        ok: false,
        msg: "Upstream returned non-JSON",
        raw: text.slice(0, 500),
      });
    }
  } catch (err) {
    console.error("filesProxy error:", err);
    return res.status(500).json({
      ok: false,
      error: String(err),
    });
  }
}
