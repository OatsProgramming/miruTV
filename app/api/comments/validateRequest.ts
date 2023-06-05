import handleError from "@/lib/handleError";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export default async function validateRequest(req: Request, method: Method) {
    const session = await getServerSession(authOptions)
    if (!session) return new Response("User not signed in", { status: 401 })

    try {
        let message;
        const args = await req.json()

        // Essential ( compare w/ sesh user id to prevent unwanted tempering )
        switch(method) {
            case 'POST': {
                const { epId, body } = args
                if (!epId || !body) {
                    message = 
                    `Is missing...
                        Episode ID?     ${!epId}
                        Comment Body?   ${!body}
                    `
                }  
                break;
            }
            case 'PATCH': {
                const { commentId, commentBody } = args
                if (!commentId || !commentBody) {
                    message = 
                    `Is missing...
                        Comment ID?     ${!commentId}
                        Comment Body?   ${!commentBody}
                    `
                }  
                break;
            }
            case 'DELETE': {
                const { commentId } = args
                if (!commentId) {
                    message = 
                    `Is missing...
                        Comment ID?     ${!commentId}
                    `
                }  
                break;
            }
        }
        if (message) return new Response(message, { status: 422 })
        return { 
            ...args, 
            userId: session.user.id, 
            createdBy: session.user.name 
        }

    } catch (err) {
        return handleError(err)
    }
}