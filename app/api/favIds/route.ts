import prismadb from "@/lib/prismadb";
import validateRequest from "./validateRequest";

export async function POST(req: Request) {
    try {
        const res = await validateRequest(req)
        if (res instanceof Response) return res

        let toReturn;
        switch(res.method) {
            case 'POST': {
                const { userId, favId } = res
                await prismadb.user.update({
                    where: { id: userId },
                    data: {
                        favIds: {
                            push: {
                                animeId: favId.animeId,
                                lastVisit: favId.lastVisit
                            }
                        }
                    }
                })
                toReturn = favId
                break;
            }
            case 'DELETE': {
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
                toReturn = newFavIds
                break;
            }
        }

        return new Response(JSON.stringify(toReturn), { status: 200 })
    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}



// export async function DELETE(req: Request) {
//     try {
//         const res = await validateRequest(req, 'DELETE') 
//         if (res instanceof Response) return res

//         const { newFavIds, userId } = res
        
//         // Just replace the favIds list with a new one
//         await prismadb.user.update({ 
//             where: { id: userId },
//             data: {
//                 favIds: {
//                     set: newFavIds
//                 }
//             }
//         })
        
//         return new Response(JSON.stringify(newFavIds), { status: 200 })

//     } catch (error) {
//         const err = error as Error
//         return new Response(err.message, { status: 500 })
//     }
// }