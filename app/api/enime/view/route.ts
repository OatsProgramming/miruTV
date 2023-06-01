import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";

export async function GET(req: Request) {
    try{
        const { searchParams } = new URL(req.url)
        const animeId = searchParams.get('animeId')
        const episodeNumber = searchParams.get('episodeNumber')
        if (!episodeNumber || !animeId) {
            return new Response(
            `Is missing... 
            Anime ID?:  ${!animeId}
            Episode Number?: ${!episodeNumber}`, 
            { status: 400 })
        }

        return handleFetch(`https://api.enime.moe/mapping/${animeId}/${episodeNumber}`)
    } catch (err) {
        return handleError(err)
    }
}