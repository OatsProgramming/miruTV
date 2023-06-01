import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";

export async function GET(req: Request) {
    try{
        const { searchParams } = new URL(req.url)
        const sourceId = searchParams.get('sourceId')
        if (!sourceId) return new Response("Source ID not given", { status: 400 })

        return handleFetch(`https://api.enime.moe/source/${sourceId}`)
    } catch (err) {
        return handleError(err)
    }
}