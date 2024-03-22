import { NextResponse } from "next/server";
import validateRequest from "./validateRequest";
import prismadb from "@/lib/prismadb";


export async function POST(req: Request) {
    const res = await validateRequest(req)
    if (res instanceof Response) return res

    let toReturn;
    switch (res.method) {
        case 'DELETE': {
            const { newWatchHistoryIds, userId } = res
            await prismadb.user.update({
                where: { id: userId },
                data: {
                    watchHistoryIds: {
                        set: newWatchHistoryIds
                    }
                }
            })

            toReturn = newWatchHistoryIds
            break;
        }
        case 'POST': {
            const { epId, epTitle, img, animeTitle, userId } = res
            toReturn = await prismadb.user.update({
                where: { id: userId },
                data: {
                    watchHistoryIds: {
                        push: {
                            epId,
                            epTitle,
                            img,
                            animeTitle,
                            lastWatched: Date.now(),
                        } as WatchHistoryId
                    }
                }
            })
            toReturn = res
            break;
        }
    }    

    return NextResponse.json(toReturn)
}