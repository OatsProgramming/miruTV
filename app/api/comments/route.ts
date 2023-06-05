import prismadb from "@/lib/prismadb";
import handleError from "@/lib/handleError";
import validateRequest from "./validateRequest";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const epId = searchParams.get('epId')
        if (!epId) return new Response("Episode ID not given (Comments Route)", { status: 422 })

        const comments = await prismadb.comment.findMany({
            where: { epId }
        })

        return new Response(JSON.stringify(comments), { status: 200 })
    } catch (err) {
        return handleError(err)
    }
}

export async function POST(req: Request) {
    try {
        const res = await validateRequest(req, 'POST')
        if (res instanceof Response) return res

        const { epId, body, createdBy, userId } = res

        const comment = await prismadb.comment.create({
            data: {
                epId,
                body,
                userId,
                createdBy,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            }
        })
        
        return new Response(JSON.stringify(comment), { status: 200 })

    } catch (err) {
        return handleError(err)
    }
}

export async function PATCH(req: Request) {
    try {
        const res = await validateRequest(req, 'PATCH')
        if (res instanceof Response) return res

        const { commentId, commentBody } = res

        const comment = await prismadb.comment.update({
            where: { id: commentId },
            data: { 
                body: commentBody, 
                updatedAt: new Date().toISOString() 
            }
        })

        return new Response(JSON.stringify(comment), { status: 200 })
    } catch (err) {
        return handleError(err)
    }
}

export async function DELETE(req: Request) {
    try {
        const res = await validateRequest(req, 'DELETE')
        if (res instanceof Response) return res

        const { commentId } = res
        
        const comment = await prismadb.comment.delete({
            where: { id: commentId }
        })

        return new Response(JSON.stringify(comment), { status: 200 })
    } catch (err) {
        return handleError(err)
    }
}

