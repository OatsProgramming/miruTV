import handleError from "@/app/util/handleError"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

type Essential = {
    userId: string,
}

type PATCH = Essential & {
    favId: FavId,
    method: 'POST' | 'PATCH',
}

type POST = PATCH

type DELETE = Essential & {
    newFavIds: FavId[],
    method: 'DELETE'
}

// DONT FORGET TO RETURN METHOD IN EACH ONE
export default async function validateRequest<T extends PATCH | POST | DELETE>(req: Request) {
    try {
        // Check if user signed in
        const session = await getServerSession(authOptions)
        if (!session) return new Response("Please sign in.", { status: 401 })

        const { data, method } = await req.json() as RequestBody<FavIdsRequest>
        switch (method) {
            case 'DELETE': {
                // Must filter list on client side to be quicker
                if (!data.newFavIds) return new Response("Missing new Fav IDS", { status: 422 })
                break;
            }
            case 'PATCH':
            case 'POST': {
                if (!data.favId) return new Response("Missing Fav ID Object", { status: 422 })
                break;
            }
            default: {
                throw new Error("Method unknown")
            }
        }

        return {
            ...data,
            method,
            userId: session?.user.id
        } as T
    } catch (err) {
        return handleError(err)
    }
}