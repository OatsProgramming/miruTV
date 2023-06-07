import handleError from "@/lib/handleError"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

type ReturnType = Record<'PATCH' | 'POST', { animeId: string, userId: string }> & {  
    DELETE: { newFavIds: FavId[], userId: string }
}

export default async function validateRequest<T extends Exclude<Method, 'GET'>>(req: Request, method: T) {
    try {
        // Check if user signed in
        const session = await getServerSession(authOptions)
        if (!session) return new Response("Please sign in.", { status: 401 })

        const data = await req.json()
        switch(method) {
            case 'DELETE': {
                // Must filter list on client side to be quicker
                const { newFavIds } = data
                if (!newFavIds) {
                    return new Response("Missing new Fav IDS", { status: 422 })
                }
                return { newFavIds, userId: session.user.id } as ReturnType[T]
            }
            case 'PATCH':
            case 'POST': {
                const { animeId } = data
                if (!animeId) return new Response("Missing Anime ID", { status: 422 })
                return { animeId, userId: session.user.id } as ReturnType[T]
            } 
            default: {
                throw new Error("Method unknown")
            }
        }
    } catch (err) {
        return handleError(err)
    }
}