import handleError from "@/lib/handleError"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

type ReturnType = Record<'PATCH' | 'POST', { favId: FavId, userId: string, method: 'POST' | 'PATCH' }> & {  
    DELETE: { newFavIds: FavId[], userId: string, method: 'DELETE' }
}

// DONT FORGET TO RETURN METHOD IN EACH ONE
export default async function validateRequest(req: Request) {
    try {
        // Check if user signed in
        const session = await getServerSession(authOptions)
        if (!session) return new Response("Please sign in.", { status: 401 })

        const { data, method } = await req.json() as RequestBody<FavIdsRequest>
        switch(method) {
            case 'DELETE': {
                // Must filter list on client side to be quicker
                const { newFavIds } = data
                if (!newFavIds) {
                    return new Response("Missing new Fav IDS", { status: 422 })
                }
                return { 
                    newFavIds, 
                    method,
                    userId: session.user.id, 
                } as ReturnType['DELETE']
            }
            case 'PATCH':
            case 'POST': {
                const { favId } = data
                if (!favId) return new Response("Missing Fav ID Object", { status: 422 })
                return { 
                    favId,
                    method,
                    userId: session.user.id, 
                } as ReturnType['POST']
            } 
            default: {
                throw new Error("Method unknown")
            }
        }
    } catch (err) {
        return handleError(err)
    }
}