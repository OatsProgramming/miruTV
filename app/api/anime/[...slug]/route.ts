import { gogo } from "@/lib/consumet/anime";
import { NextResponse } from "next/server";
import anilist from "@/lib/consumet/anilist";
import lessenPayload from "../lessenPayload";
import redis from "@/lib/redis";

// TODO: Incorporate redis for caching
export async function GET(req: Request, { params: { slug } }: ParamsArr) {
    const category = slug[0]
    const param = slug[1]
    
    const defaultTTL = 3600

    if (!isValidCategory(category)) {
        return NextResponse.json("Invalid anime category", { status: 400 })
    }

    try {
        let result;

        // Too dynamic for search... Cant use it as a key
        if (category !== 'search') {
            
            // Check cache
            const cachedVal = await redis.get(param)
            if (cachedVal) {
                console.log("ANIME CACHE HIT")

                // it should already be a json obj
                // dont stringify it when returning response
                return new Response(cachedVal)
            }
        }

        switch (category) {
            case 'search': {
                if (!param) return NextResponse.json("Missing query for /anime/search", { status: 422 })

                // query
                result = await anilist.search(param)
                break;
            }
            case "info": {
                if (!param) return NextResponse.json("Missing animeId for /anime/info", { status: 422 })

                // animeId
                result = await anilist.fetchAnimeInfo(param)
                break;
            }
            case "source": {
                if (!param) return NextResponse.json("Missing epId for /anime/source", { status: 422 })

                // epId
                result = await gogo.fetchEpisodeSources(param)
                break;
            }
            case "episodes" : {
                if (!param) return NextResponse.json("Missing anime title (query) for /anime/episodes", { status: 422 })
                const animeRes = await anilist.search(param)
                if (!animeRes.results || animeRes.results.length === 0) throw new Error("Anime not found")

                const anime = animeRes.results[0]
                result = await anilist.fetchAnimeInfo(anime.id)
                break;
            }
            default: {
                throw new Error("Invalid anime category given (/anime)")
            }
        }    

        // dumb type err (missing AnimeRecent)
        // @ts-expect-error
        lessenPayload(result)

        // Cache the result after making the payload smaller
        if (category !== 'search') {
            const stringifyResult = JSON.stringify(result)
            await redis.setex(param, defaultTTL, stringifyResult)
            console.log("ANIME CACHE MISS")
        }

        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}

function isValidCategory(str: string): str is AnimeCategory {
    const validSlug = new Set(['search', 'info', 'source', 'episodes'])
    return validSlug.has(str)
}