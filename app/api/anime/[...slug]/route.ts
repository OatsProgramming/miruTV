import { NextResponse } from "next/server";
import lessenPayload from "../lessenPayload";
import apiUrl from "@/app/util/apiUrl";
import redisGet from "@/app/util/redis/redisGet";
import redisSet from "@/app/util/redis/redisSet";
import isValidCategory from "../util/isValidCategory";
import getAnilistInfo from "../util/getAnilistInfo";

export async function GET(req: Request, { params: { slug } }: ParamsArr) {
    const category = slug[0]
    let param = slug[1]

    const defaultTTL = 1800

    const isValidSearch = param
        ? param.startsWith('SEARCH: ')
        : 0


    const apiRoutes = {
        recents: 'anime/gogoanime/recent-episodes',
        trending: 'meta/anilist/trending',
        popular: 'meta/anilist/popular',
        search: 'meta/anilist/',             //query
        info: 'meta/anilist/info/',          //animeId
        source: 'anime/gogoanime/watch/'     //epId
    }

    if (!isValidCategory(category)) {
        return NextResponse.json("Invalid anime category", { status: 400 })
    }

    try {
        // Too dynamic for just search... 
        // Only cache a 'search' if its by developer
        if (isValidSearch) {
            const start = param.indexOf(': ')
            param = param.slice(start + 2, -1)
        }

        const cachedVal = await redisGet({
            condition: (category !== 'search' || isValidSearch),
            cacheCategory: `ANIME ${category.toUpperCase()}`,
            key: param || category,
        })

        // it should already be a json obj
        // dont stringify it when returning response
        // if (cachedVal) return new Response(cachedVal)


        // Check for any missing requirments
        if (!param) {
            switch (category) {
                case 'search': {
                    return NextResponse.json(`Missing query for SEARCH`)
                }
                case 'info': {
                    return NextResponse.json(`Missing anime ID for INFO`)
                }
                case 'source': {
                    return NextResponse.json(`Missing episode ID for SOURCE`)
                }
            }
        }

        const url =
            apiUrl
            + apiRoutes[category]
            + (param ? `/${param}` : '')

        let result;

        if (category === 'info') result = await getAnilistInfo(url)

        else {
            const res = await fetch(url, { next: { revalidate: 0 } }) // dont forget to remove nextjs automatic caching feature...

            if (!res.ok) {
                throw new Error("Failed to fetch" + await res.text())
            }

            result = await res.json()
        }


        lessenPayload(result)

        const stringifyResult = JSON.stringify(result)

        // Cache the result after making the payload smaller
        await redisSet({
            condition:
                (
                    category !== 'search'
                    || isValidSearch                                                // Cache if category === 'search' and its by developer
                    || !('episodes' in result && result.episodes.length > 100)      // Don't cache huge chunks of data. Might overload redis
                ),
            key: param || category,
            ttl: defaultTTL,
            toCache: stringifyResult,
            cacheCategory: `ANIME ${category}`
        })

        return new Response(stringifyResult)
    } catch (err) {
        console.error(err)
        return NextResponse.json(err, { status: 500 })
    }
}