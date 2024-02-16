import redis from "@/lib/redis";
import ratelimit from "@/lib/upstash/ratelimit";

export default async function redisSet({ condition, key, toCache, ip, ttl = 10, cacheCategory }: {
    condition: boolean | number
    key: string,
    toCache: string,
    ip: string | null,
    ttl?: number,
    cacheCategory?: string
}) {
    if (!condition) return

    const result = await ratelimit(ip)
    if (result instanceof Response) return result

    await redis.setex(key, ttl, toCache)
    console.log(`${cacheCategory} CACHE MISS`)
}