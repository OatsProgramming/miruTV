import redis from "@/lib/redis";

export default async function redisGet({ condition, key, cacheCategory }: {
    condition: number | boolean,
    key: string,
    cacheCategory?: string
}) {

    if (!condition) {
        return
    }

    const cacheVal = await redis.get(key)
    if (cacheVal) {
        console.log(`${cacheCategory} CACHE HIT`)
        return cacheVal
    }
}