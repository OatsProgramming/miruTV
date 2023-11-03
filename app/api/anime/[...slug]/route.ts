import { gogo } from "@/lib/consumet/anime";
import { NextResponse } from "next/server";
import anilist from "@/lib/consumet/anilist";
import lessenPayload from "../lessenPayload";
import redis from "@/lib/redis";

// Switching to just gogo for the most part...
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
            const cachedVal = await redis.get(param || category)
            if (cachedVal) {
                console.log(`ANIME (${category.toUpperCase()}) CACHE HIT`)

                // it should already be a json obj
                // dont stringify it when returning response
                return new Response(cachedVal)
            }
        }


        switch (category) {
            case 'search': {
                if (!param) return NextResponse.json("Missing query for /anime/search", { status: 422 })
                // query
                result = await gogo.search(param)
                break;
            }
            case "info": {

                if (!param) return NextResponse.json("Missing animeId for /anime/info", { status: 422 })
                // animeId
                // Note: This is no longer working
                // result = await anilist.fetchAnimeInfo(param)

                // Using gogo instead
                result = await gogo.fetchAnimeInfo(param)
                break;
            }
            case "source": {
                if (!param) return NextResponse.json("Missing epId for /anime/source", { status: 422 })

                // epId
                result = await gogo.fetchEpisodeSources(param)
                break;
            }
            // Note: If using gogo for "info", then theres no need for this.
            // epId is literally TITLE-episode-NUMBER 
            // id is literally the title (english) lowercase with "-"
            // Just do numbers instead of imgs when showcasing episodes... ( gogo doesnt have ep images )

            // case "episodes" : {
            //     if (!param) return NextResponse.json("Missing anime title (query) for /anime/episodes", { status: 422 })
            //     const animeRes = await anilist.search(param)
            //     if (!animeRes.results || animeRes.results.length === 0) throw new Error("Anime not found")
    
            //     const anime = animeRes.results[0]
            //     result = await anilist.fetchAnimeInfo(anime.id)
            //     break;
            // }

            case 'popular': {
                result = await anilist.fetchPopularAnime()
                break;
            } 
            case 'recents': {
                result = await gogo.fetchRecentEpisodes()
                break;
            }
            case 'trending': {
                result = await anilist.fetchTrendingAnime()
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

            // Check if param exist to use as key 
            // ( otherwise itd be just the category name )
            await redis.setex(param || category, defaultTTL, stringifyResult)
            console.log("ANIME CACHE MISS")
        }

        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}

function isValidCategory(str: string): str is AnimeCategory {
    const validSlug = new Set<string>(['search', 'info', 'source', 'recents', 'trending', 'popular'] as AnimeCategory[])
    return validSlug.has(str)
}