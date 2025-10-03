import { getLogger } from './logger.js';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 5, windowMs = 15000) { // 5 requests per 15 seconds
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(userId: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(userId);

    if (!entry || now > entry.resetTime) {
      // Reset or create new entry
      this.limits.set(userId, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      getLogger().warn({
        event: 'rate_limit_exceeded',
        userId,
        count: entry.count,
        maxRequests: this.maxRequests
      }, 'Rate limit exceeded');
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingRequests(userId: string): number {
    const entry = this.limits.get(userId);
    if (!entry || Date.now() > entry.resetTime) {
      return this.maxRequests;
    }
    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(userId: string): number {
    const entry = this.limits.get(userId);
    if (!entry) {
      return Date.now() + this.windowMs;
    }
    return entry.resetTime;
  }

  // Clean up expired entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [userId, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(userId);
      }
    }
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => {
  rateLimiter.cleanup();
}, 5 * 60 * 1000);

export function checkRateLimit(userId: string): boolean {
  return rateLimiter.isAllowed(userId);
}

export function getRateLimitInfo(userId: string): {
  remaining: number;
  resetTime: number;
} {
  return {
    remaining: rateLimiter.getRemainingRequests(userId),
    resetTime: rateLimiter.getResetTime(userId)
  };
}
