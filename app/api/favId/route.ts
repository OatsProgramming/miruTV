import prismadb from "@/lib/prismadb";
import validateRequest from "./validateRequest";
import handleError from "@/lib/handleError";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    try { 
        const session = await getServerSession(authOptions)
        if (!session) return new Response("User not signed in", { status: 401 })

        // Better to go thru user rather than favIds and match favIds with userId
        // Most likely to have less users saved than favIds
        const user = await prismadb.user.findFirst({ 
            where: { id: session.user.id },
            include: {
                favIds: true
            }
        })

        if (!user) return new Response("User not found", { status: 404 })

        return new Response(JSON.stringify(user.favIds), { status: 200 })
        
    } catch (err) {
        return handleError(err)
    }
}

export async function POST(req: Request) {
    try {
        const res = await validateRequest(req)
        if (res instanceof Response) return res

        const { favId, userId } = res

        await prismadb.user.update({
            // Specify the user
            where: { id: userId },
            data: {
                favIds: {
                    upsert: {
                        // Update if it exists
                        where: { id: favId },
                        update: {
                            lastVisit: new Date().toISOString()
                        },
                        // Create if it doesnt
                        create: {
                            id: favId,
                            lastVisit: new Date().toISOString()
                        },
                    }
                }
            },
        })

        return new Response(favId, { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}



export async function DELETE(req: Request) {
    try {
        const res = await validateRequest(req) 
        if (res instanceof Response) return res

        const { favId, userId } = res
        
        await prismadb.user.update({
            // Specify the user
            where: { id: userId },
            data: {
                // Only target the specified favId
                favIds: {
                    delete: { id: favId }
                }
            }
        })
        
        return new Response(favId, { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}