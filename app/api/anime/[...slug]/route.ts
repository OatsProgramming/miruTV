import { NextResponse } from "next/server";
import lessenPayload from "../lessenPayload";
import apiUrl from "@/app/util/apiUrl";
import redis from "@/lib/redis";

// Switching to just gogo for the most part...
export async function GET(req: Request, { params: { slug } }: ParamsArr) {
    const category = slug[0]
    const param = slug[1]
    
    const defaultTTL = 3600

    const apiRoutes = {
        recents: 'anime/gogoanime/recent-episodes',
        trending: 'meta/anilist/trending',
        popular: 'meta/anilist/popular',
        search: 'anime/gogoanime/',         //query
        info: 'meta/anilist/info/',         //animeId
        source: 'anime/gogoanime/watch/'    //epId
    }

    if (!isValidCategory(category)) {
        return NextResponse.json("Invalid anime category", { status: 400 })
    }

    const url = 
            apiUrl 
            + apiRoutes[category] 
            + (param ? `/${param}` : '')

    try {
        // Too dynamic for search... Cant use it as a key
        // if (category !== 'search') {
            
        //     // Check cache
        //     const cachedVal = await redis.get(param || category)
        //     if (cachedVal) {
        //         console.log(`ANIME (${category.toUpperCase()}) CACHE HIT`)

        //         // it should already be a json obj
        //         // dont stringify it when returning response
        //         return new Response(cachedVal)
        //     }
        // }

        if (!param) {
            switch (category) {
                case 'search': {
                    return NextResponse.json(`Missing query for SEARCH: ${url}`)
                }
                case 'info': {
                    return NextResponse.json(`Missing anime ID for INFO: ${url}`)
                }
                case 'source': {
                    return NextResponse.json(`Missing episode ID for SOURCE: ${url}`)
                }
            }
        }

        const res = await fetch(url)

        if (!res.ok) {
            throw new Error("Failed to fetch" + await res.text())
        }

        const result = await res.json()
          
        lessenPayload(result)
        
        // Cache the result after making the payload smaller
        // if (category !== 'search') {
        //     const stringifyResult = JSON.stringify(result)

        //     // Check if param exist to use as key 
        //     // ( otherwise itd be just the category name )
        //     await redis.setex(param || category, defaultTTL, stringifyResult)
        //     console.log("ANIME CACHE MISS")
        // }

        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}

function isValidCategory(str: string): str is AnimeCategory {
    const validSlug = new Set<string>(['search', 'info', 'source', 'recents', 'trending', 'popular'] as AnimeCategory[])
    return validSlug.has(str)
}
