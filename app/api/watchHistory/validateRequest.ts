import handleError from "@/app/util/handleError";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";

type Essential = {
    userId: string
}

type POST = Essential & Omit<WatchHistoryId, 'lastWatched'> & {
    method: 'POST'
}

type DELETE = Essential & {
    method: 'DELETE',
    newWatchHistoryIds: WatchHistoryId[]
}

export default async function validateRequest<T extends POST | DELETE>(req: Request) {
    try {

        // Check if user is signed in
        // const session = await getServerSession(authOptions)
        // if (!session) return new Response("Please sign in.", { status: 401 })
        const userId = '65b20af5dbcfe30e941c381f'

        const { data, method } = await req.json() as RequestBody<WatchHistoryIdRequest>


        switch (method) {
            case 'DELETE': {
                if (data) {
                    
                }
                break;
            }
            case 'POST': {
                // @ts-ignore
                if (!data.epTitle || !data.img || !data.animeTitle || !data.epId) {
                    return new Response(
                        `Is missing...
                            Episode Title?      ${!data}
                            Episode Image?      ${!data}
                            Anime Title?        ${!data}
                            (Method: ${method})
                `, { status: 422 })
                }
            }
        }

        return {
            ...data,
            method,
            userId
        } as T

    } catch (err) {
        return handleError(err)
    }
}