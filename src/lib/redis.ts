import { Redis } from "ioredis";

// Use the local redis server we just installed on the AWS instance
const globalForRedis = global as unknown as { redis: Redis };

export const redis =
  globalForRedis.redis ||
  new Redis(process.env.REDIS_URL || "redis://localhost:6379");

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;

/**
 * A helper to cache Prisma queries in Redis
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached) as T;

    const data = await fetcher();
    if (data) {
      await redis.setex(key, ttlSeconds, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    console.error("Redis cache error:", error);
    // Fallback to fetcher if Redis is down
    return await fetcher();
  }
}
