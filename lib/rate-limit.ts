type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitConfig = {
  windowMs: number;
  max: number;
  keyPrefix?: string;
};

export function rateLimit(config: RateLimitConfig) {
  return function checkRateLimit(key: string) {
    const now = Date.now();
    const storeKey = `${config.keyPrefix ?? "rl"}:${key}`;
    const entry = store.get(storeKey);

    if (!entry || now > entry.resetAt) {
      store.set(storeKey, { count: 1, resetAt: now + config.windowMs });
      return { allowed: true, remaining: config.max - 1, resetAt: now + config.windowMs };
    }

    if (entry.count >= config.max) {
      return { allowed: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return { allowed: true, remaining: config.max - entry.count, resetAt: entry.resetAt };
  };
}

export const apiLimiter = rateLimit({ windowMs: 60_000, max: 120, keyPrefix: "api" });
export const authLimiter = rateLimit({ windowMs: 60_000, max: 10, keyPrefix: "auth" });
export const strictLimiter = rateLimit({ windowMs: 60_000, max: 5, keyPrefix: "strict" });
