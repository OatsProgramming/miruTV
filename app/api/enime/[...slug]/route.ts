import handleError from "@/lib/handleError";
import redis from "@/lib/redis";

export async function GET(req: Request, { params: { slug } }: ParamsArr) {
    let defaultTTL = 3600 // 1 hr
    const toCache = new Set(['source']) // Still debating what to cache for faster UX
    try {
        const route = slug.join('/')
        const url = `https://api.enime.moe/${route}`

        // Check cache
        if (toCache.has(slug[0])) {
            const cachedVal = await redis.get(route)
            if (cachedVal) {
                console.log("ENIME CACHE HIT")
                return new Response(cachedVal)
            }
        }

        // Otherwise fetch then cache
        const res = await fetch(url)
        if (!res.ok) {
            const result = await res.text()
            return new Response(result, { status: 500 })
        }
        // Make sure that its a valid json object first to store in cache
        const result = await res.json()

        const stringifyResult = JSON.stringify(result)

        // Cache only whats necessary (and small enough for request size when getting it back)
        if (toCache.has(slug[0])) {
            await redis.setex(route, defaultTTL, stringifyResult)
            console.log("ENIME CACHE MISS")
        }

        return new Response(stringifyResult, { status: 200 })
    } catch (err) {
        return handleError(err)
    }
}