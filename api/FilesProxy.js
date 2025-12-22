export default async function handler(req, res) {
  // 1. CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // 2. Handle Preflight
  if (req.method === "OPTIONS") return res.status(204).end();
  const FILES_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyM5SPa85Og4JuUKsyJceBPDloelFGlUIrrbGw3Yw-Jte5GrUC8JnmF0ZN_9pgIXvSzuw/exec";

  try {
    let upstreamResponse;

    // 3. Handle GET Requests (Forward Query Params)
    if (req.method === "GET") {
      // Construct URL with query parameters from the request
      const url = new URL(FILES_SCRIPT_URL);
      // Copy query params (e.g. ?folderId=xyz) to the Google Script URL
      Object.keys(req.query).forEach(key => url.searchParams.append(key, req.query[key]));

      upstreamResponse = await fetch(url.toString(), {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
    } 
    
    // 4. Handle POST Requests (Forward Body)
    else if (req.method === "POST") {
      let body = {};
      try {
        // Parse body manually for serverless environments
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
      } catch (e) {
        body = {};
      }

      upstreamResponse = await fetch(FILES_SCRIPT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } else {
        return res.status(405).json({ ok: false, msg: "Method not allowed" });
    }

    // 5. Return the response from Google Apps Script
    const text = await upstreamResponse.text();
    try {
      const json = JSON.parse(text);
      return res.status(upstreamResponse.status).json(json);
    } catch {
      // If GAS returns HTML (error page) or non-JSON
      return res.status(502).json({ 
        ok: false, 
        msg: "Upstream returned non-JSON. Check Apps Script deployment.", 
        raw: text 
      });
    }

  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}