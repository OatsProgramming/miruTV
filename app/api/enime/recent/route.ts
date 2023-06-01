import handleError from "@/lib/handleError"
import { handleFetch } from "@/lib/handleFetch"

export async function GET(req: Request) {
    try {
        return handleFetch('https://api.enime.moe/recent')
    } catch (error) {
        return handleError(error)
    }
}