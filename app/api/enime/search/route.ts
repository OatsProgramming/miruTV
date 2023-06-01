import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";

export async function GET(req: Request) {
    try{
        const { searchParams } = new URL(req.url)
        const q = searchParams.get('q')
        if (!q) return new Response("Query not given", { status: 400 })

        return handleFetch(`https://api.enime.moe/search/${q}`)
    } catch (err) {
        return handleError(err)
    }
}