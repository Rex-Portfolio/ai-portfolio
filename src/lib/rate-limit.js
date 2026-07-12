const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 60_000;

/** @type {Map<string, { count: number; resetAt: number }>} */
const hits = new Map();

/**
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * @param {string} key
 * @param {{ limit?: number; windowMs?: number }} [options]
 * @returns {{ allowed: true; remaining: number } | { allowed: false; retryAfterSeconds: number }}
 */
export function checkRateLimit(
  key,
  { limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS } = {},
) {
  const now = Date.now();
  pruneExpired(now);

  const entry = hits.get(key);

  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count };
}

/**
 * @param {number} now
 */
function pruneExpired(now) {
  if (hits.size < 500) {
    return;
  }

  for (const [key, entry] of hits) {
    if (now >= entry.resetAt) {
      hits.delete(key);
    }
  }
}
