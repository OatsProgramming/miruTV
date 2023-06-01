import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prismadb from "@/lib/prismadb";

export async function PATCH(req: Request) {
    try {
        // Check if user signed in
        const session = await getServerSession(authOptions) as Sesh
        if (!session) return new Response("Please sign in.", { status: 401 })

        const newFavId = await req.json()

        // Append newFavId
        await prismadb.user.update({
            where: { id: session.user.id },
            data: {
                favIds: {
                    push: newFavId
                }
            }
        })

        return new Response(JSON.stringify(newFavId), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        // Check if user signed in
        const session = await getServerSession(authOptions) as Sesh
        if (!session) return new Response("Please sign in.", { status: 401 })

        const removeId = await req.json()

        // Find the user to overwrite favIds
        const user = await prismadb.user.findUnique({
            where: { id: session.user.id }
        })

        if (!user) return new Response("User not found", { status: 404 })

        const newFavIds = user.favIds.filter((id) => id !== removeId)

        // Update favIds
        await prismadb.user.update({
            where: { id: session.user.id },
            data: {
                favIds: newFavIds
            }
        })

        return new Response(JSON.stringify(removeId), { status: 200 })

    } catch (error) {
        const err = error as Error
        return new Response(err.message, { status: 500 })
    }
}

