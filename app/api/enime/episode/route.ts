import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";

export async function GET(req: Request) {
    try{
        const { searchParams } = new URL(req.url)
        const episodeId = searchParams.get('episodeId')
        if (!episodeId) return new Response("Episode ID not given", { status: 400 })

        return handleFetch(`https://api.enime.moe/episode/${episodeId}`)
    } catch (err) {
        return handleError(err)
    }
}