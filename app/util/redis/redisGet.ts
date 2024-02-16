import redis from "@/lib/redis";
import ratelimit from '@/lib/upstash/ratelimit'

export default async function redisGet({ condition, key, ip, cacheCategory }: {
    condition: number | boolean,
    key: string,
    ip: string | null,
    cacheCategory?: string
}) {

    if (!condition) return

    const result = await ratelimit(ip)
    if (result instanceof Response) return result

    const cacheVal = await redis.get(key)
    if (cacheVal) {
        console.log(`${cacheCategory} CACHE HIT`)
        return cacheVal
    }
}