import prismadb from "@/lib/prismadb";
import validateRequest from "./validateRequest";

export async function POST(req: Request) {
    try {
        const res = await validateRequest(req, 'POST')
        if (res instanceof Response) return res

        const { userId, animeId } = res
        const lastVisit = new Date().toISOString()

        await prismadb.user.update({
            where: { id: userId },
            data: {
                favIds: {
                    push: {
                        animeId, lastVisit
                    }
                }
            }
        })

        return new Response(JSON.stringify(animeId), { status: 200 })
    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}



export async function DELETE(req: Request) {
    try {
        const res = await validateRequest(req, 'DELETE') 
        if (res instanceof Response) return res

        const { newFavIds, userId } = res
        
        // Just replace the favIds list with a new one
        await prismadb.user.update({ 
            where: { id: userId },
            data: {
                favIds: {
                    set: newFavIds
                }
            }
        })
        
        return new Response(JSON.stringify(newFavIds), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}