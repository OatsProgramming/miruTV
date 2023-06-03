import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";
import episodeToy from "@/lib/toyData/episodeToy";

export async function GET( { params: { slug }}: ParamsArr ) {
    try{
        const route = slug.join('/')
        return handleFetch(`https://api.enime.moe/${route}`)
    } catch (err) {
        return handleError(err)
    }
}