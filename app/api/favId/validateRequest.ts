import handleError from "@/lib/handleError"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export default async function validateRequest(req: Request) {
    try {
        // Check if user signed in
        const session = await getServerSession(authOptions) as Sesh
        if (!session) return new Response("Please sign in.", { status: 401 })

        const { favId } = await req.json()
        if (!favId) return new Response("Missing Fav ID", { status: 422 })

        return { favId, userId: session.user.id }
    } catch (err) {
        return handleError(err)
    }
}