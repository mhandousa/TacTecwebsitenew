import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
  limit?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

interface RateLimiterStrategy {
  readonly interval: number;
  readonly limit: number;
  check(identifier: string, limit?: number): Promise<RateLimitResult>;
}

class MemoryRateLimiter implements RateLimiterStrategy {
  private cache: LRUCache<string, number[]>;
  readonly interval: number;
  readonly limit: number;

  constructor(options: RateLimitOptions) {
    this.interval = options.interval;
    this.limit = options.limit ?? 5;

    this.cache = new LRUCache({
      max: options.uniqueTokenPerInterval,
      ttl: options.interval,
    });
  }

  async check(identifier: string, limit: number = this.limit): Promise<RateLimitResult> {
    const now = Date.now();
    const timestamps = this.cache.get(identifier) || [];

    const validTimestamps = timestamps.filter(ts => now - ts < this.interval);

    const isAllowed = validTimestamps.length < limit;

    if (isAllowed) {
      validTimestamps.push(now);
      this.cache.set(identifier, validTimestamps);
    }

    const oldestTimestamp = validTimestamps[0] || now;
    const resetTime = oldestTimestamp + this.interval;

    return {
      success: isAllowed,
      limit,
      remaining: Math.max(0, limit - validTimestamps.length),
      reset: resetTime,
    };
  }
}

class UpstashHttpRateLimiter implements RateLimiterStrategy {
  private readonly baseUrl: string;
  private readonly token: string;
  readonly interval: number;
  readonly limit: number;

  constructor(options: RateLimitOptions & { baseUrl: string; token: string }) {
    this.interval = options.interval;
    this.limit = options.limit ?? 5;
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.token = options.token;
  }

  private async command<T>(args: (string | number)[]): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Upstash request failed with status ${response.status}: ${text}`);
    }

    const data = (await response.json()) as { result: T };
    return data.result;
  }

  async check(identifier: string, limit?: number): Promise<RateLimitResult> {
    const key = `ratelimit:contact:${identifier}`;
    const current = await this.command<number>(['INCR', key]);

    if (current === 1) {
      await this.command(['PEXPIRE', key, this.interval]);
    }

    const ttl = await this.command<number>(['PTTL', key]);
    const enforcedLimit = limit ?? this.limit;
    const remaining = Math.max(0, enforcedLimit - current);
    const success = current <= enforcedLimit;
    const reset = Date.now() + (ttl > 0 ? ttl : this.interval);

    return {
      success,
      limit: enforcedLimit,
      remaining,
      reset,
    };
  }
}

const baseOptions: RateLimitOptions = {
  interval: 15 * 60 * 1000,
  uniqueTokenPerInterval: 500,
  limit: 5,
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const isProduction = process.env.NODE_ENV === 'production';

const memoryLimiter = new MemoryRateLimiter(baseOptions);
const persistentLimiter = redisUrl && redisToken ? new UpstashHttpRateLimiter({ ...baseOptions, baseUrl: redisUrl, token: redisToken }) : null;

if (!persistentLimiter) {
  const message =
    'Upstash credentials are required for durable rate limiting. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to prevent in-memory fallback.';

  if (isProduction) {
    throw new Error(message);
  }

  console.warn(
    `${message} Using the in-memory fallback because the credentials are missing in this environment.`,
  );
}

export const ratelimit = {
  async check(identifier: string, limit?: number): Promise<RateLimitResult> {
    if (persistentLimiter) {
      try {
        return await persistentLimiter.check(identifier, limit);
      } catch (error) {
        console.error('Durable rate limiter failed, falling back to in-memory limiter.', error);
      }
    }

    return memoryLimiter.check(identifier, limit);
  },
  get interval() {
    return (persistentLimiter ?? memoryLimiter).interval;
  },
  get limit() {
    return (persistentLimiter ?? memoryLimiter).limit;
  },
};

