import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export class RateLimiter {
  private cache: LRUCache<string, number[]>;
  private interval: number;
  private limit: number;

  constructor(options: RateLimitOptions = { interval: 15 * 60 * 1000, uniqueTokenPerInterval: 500 }) {
    this.interval = options.interval;
    this.limit = 5; // 5 requests per interval
    
    this.cache = new LRUCache({
      max: options.uniqueTokenPerInterval || 500,
      ttl: options.interval,
    });
  }

  check(identifier: string, limit: number = this.limit): RateLimitResult {
    const now = Date.now();
    const timestamps = this.cache.get(identifier) || [];
    
    // Remove old timestamps outside the window
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

// Export singleton instance
export const ratelimit = new RateLimiter({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
});
