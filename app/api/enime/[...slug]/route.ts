import handleError from "@/lib/handleError";
import redis from "@/lib/redis";

// ??? Vercel still caching ??? Still using stale data?
export const fetchCache = 'force-no-store'

export async function GET(req: Request, { params: { slug } }: ParamsArr) {
    let defaultTTL = 3600 // 1 hr
    const toRedis = new Set(['source']) // Still debating what to cache for faster UX
    const toCache = new Set(['recent', 'popular', 'info'])
    try {
        const route = slug.join('/')
        const url = `https://api.enime.moe/${route}`

        // Check cache
        if (toRedis.has(slug[0])) {
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
        if (toRedis.has(slug[0])) {
            await redis.setex(route, defaultTTL, stringifyResult)
            console.log("ENIME CACHE MISS")
        }

        let cacheControl = 'public, s-maxage=1000, stale-while-revalidate=500'
        if (toCache.has(slug[0])) cacheControl = 'public, s-maxage=3600, stale-while-revalidate=1800'

        return new Response(stringifyResult, {
            status: 200, 
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': cacheControl,
                'Vercel-CDN-Cache-Control': 's-maxage=1000',
                'CDN-Cache-Control': 's-maxage=1000'
            }
        })
    } catch (err) {
        return handleError(err)
    }
}