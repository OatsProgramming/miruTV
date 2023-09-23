import { gogo } from "@/lib/consumet/anime";
import { NextResponse } from "next/server";
import anilist from "@/lib/consumet/anilist";
import getAnimeTitle from "@/app/util/getAnimeTitle";

export async function GET(req: Request, { params: { slug } }: ParamsArr) {
    const category = slug[0]
    const param = slug[1]

    if (!isValidCategory(category)) {
        return NextResponse.json("Invalid anime category", { status: 400 })
    }

    try {
        let result;

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