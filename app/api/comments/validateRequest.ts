import handleError from "@/app/util/handleError";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]/options";

type Essential = {
    userId: string,
    createdBy: string,
}

type PATCH = Essential & {
    method: 'PATCH',
    commentId: string,
    body: string,
}

type DELETE = Essential & {
    method: 'DELETE',
    commentId: string,
}

// delete wont work unless the property is optional
type POST = Essential & {
    method?: 'POST'
    epId: string,
    body: string,
} | {
    method?: 'POST',
    repliedTo: string,
    body: string
}

export default async function validateRequest<T extends PATCH | POST | DELETE>(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new Response("User not signed in", { status: 401 })

    try {
        let message;
        const res = await req.json() as RequestBody<CommentRequest>

        // Essential ( compare w/ sesh user id to prevent unwanted tempering )
        switch (res.method) {
            case 'POST': {
                const { epId, body, repliedTo } = res.data
                if ((!epId && !repliedTo) || !body) {
                    message =
                        `Is missing...
                        Either Ep ID or Comment ID (for repliedTo)?     ${!epId && !repliedTo}
                        Comment Body?                                   ${!body}
                        (Method: ${res.method})
                    `
                }
                break;
            }
            case 'PATCH': {
                const { commentId, body } = res.data
                if (!commentId || !body) {
                    message =
                        `Is missing...
                        Comment ID?     ${!commentId}
                        Comment Body?   ${!body}
                        (Method: ${res.method})
                    `
                }
                break;
            }
            case 'DELETE': {
                const { commentId } = res.data
                if (!commentId) message = `Missing Comment ID (Method: ${res.method})`
                break;
            }
        }
        if (message) return new Response(message, { status: 422 })
        return {
            ...res.data,
            method: res.method,
            userId: session.user.id,
            createdBy: session.user.name
        } as T

    } catch (err) {
        return handleError(err)
    }
}