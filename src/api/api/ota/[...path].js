export default async function handler(req, res) {
  // Allow your real origin in prod; "*" is fine for quick tests
  const ALLOW_ORIGIN = "*";

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    return res.status(200).end();
  }

  // Build upstream URL: /api/ota/... -> https://ota-api.a4aero.com/api/...
  const path = Array.isArray(req.query.path) ? req.query.path.join("/") : "";
  const upstream = new URL(`https://ota-api.a4aero.com/api/${path}`);

  // Preserve query string
  for (const [k, v] of Object.entries(req.query)) {
    if (k !== "path") upstream.searchParams.append(k, v);
  }

  // Prepare body for non-GET/HEAD
  let body;
  if (!["GET", "HEAD"].includes(req.method)) {
    // Vercel req.body may already be parsed json; ensure we send string
    body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body || {});
  }

  // Forward selected headers only
  const headers = {
    "Content-Type": req.headers["content-type"] || "application/json",
  };
  if (req.headers.authorization)
    headers["Authorization"] = req.headers.authorization;

  try {
    const upstreamRes = await fetch(upstream.toString(), {
      method: req.method,
      headers,
      body,
    });

    // Read raw text so we can forward even 204/empty bodies
    const text = await upstreamRes.text();

    // Always add CORS headers for the browser
    res.status(upstreamRes.status);
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    // Try to keep upstream content-type if present
    res.setHeader(
      "Content-Type",
      upstreamRes.headers.get("content-type") || "application/json"
    );

    return res.send(text);
  } catch (err) {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    return res.status(502).json({ error: "Proxy error", detail: String(err) });
  }
}
