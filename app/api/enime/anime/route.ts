import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";

export async function GET(req: Request) {
    try{
        const { searchParams } = new URL(req.url)
        const animeId = searchParams.get('animeId')
        if (!animeId) return new Response("Anime ID not given", { status: 400 })

        return handleFetch(`https://api.enime.moe/anime/${animeId}/episodes`)
    } catch (err) {
        return handleError(err)
    }
}