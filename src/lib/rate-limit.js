const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 60_000;
const DAILY_CAP = Number(process.env.DIAGNOSE_DAILY_CAP) || 100;

/** @type {Map<string, { count: number; resetAt: number }>} */
const hits = new Map();

// These counters live in server memory, so on serverless hosting they are
// per instance and reset on cold starts. A spend limit in the Anthropic
// Console is the hard ceiling; these just keep normal traffic cheap.
let daily = { day: "", count: 0 };

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
 * Counts one model call against the site-wide daily cap.
 * @returns {boolean} false when today's cap is used up
 */
export function takeDailyBudget() {
  const today = new Date().toISOString().slice(0, 10);
  if (daily.day !== today) {
    daily = { day: today, count: 0 };
  }
  if (daily.count >= DAILY_CAP) {
    return false;
  }
  daily.count += 1;
  return true;
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
