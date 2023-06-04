import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";

export async function GET(req: Request, { params: { slug }}: ParamsArr ) {
    try{
        const route = slug.join('/')
        return handleFetch(`https://api.enime.moe/${route}`)
    } catch (err) {
        return handleError(err)
    }
}