// Small helpers shared by the Vercel functions in api/.

export function setCors(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

/** Reads a JSON request body; Vercel may already have parsed it. */
export async function readBody(req) {
    if (req.body && typeof req.body === "object") return req.body;
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    return JSON.parse(Buffer.concat(chunks).toString() || "{}");
}
