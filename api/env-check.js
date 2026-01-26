// api/env-check.js
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ ok: false, msg: "Method not allowed" });

  const hasViteAuth = Boolean(process.env.VITE_AUTH_URL);
  const hasAuth = Boolean(process.env.AUTH_URL);
  const hasViteFiles = Boolean(process.env.VITE_FILES_URL);
  const hasFiles = Boolean(process.env.FILES_URL);
  const vercelEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown";

  return res.status(200).json({
    ok: true,
    vercelEnv,
    vars: {
      VITE_AUTH_URL: hasViteAuth,
      AUTH_URL: hasAuth,
      VITE_FILES_URL: hasViteFiles,
      FILES_URL: hasFiles,
    }
  });
}
