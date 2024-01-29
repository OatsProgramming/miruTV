import redis from "@/lib/redis";

export default async function redisSet({ condition, key, toCache, ttl = 10, cacheCategory }: {
    condition: boolean | number
    key: string,
    toCache: string,
    ttl?: number,
    cacheCategory?: string
}) {
    if (!condition) return

    await redis.setex(key, ttl, toCache)
    console.log(`${cacheCategory} CACHE MISS`)
}