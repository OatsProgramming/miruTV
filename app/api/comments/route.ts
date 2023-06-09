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
    const res = await validateRequest(req)
    if (res instanceof Response) return res

    try {
        switch(res.method) {
            case 'DELETE': {
                await prismadb.comment.delete({
                    where: { id: res.commentId }
                })
                break;
            }
            case 'PATCH': {
                await prismadb.comment.update({
                    where: { id: res.commentId },
                    data: {
                        body: res.body,
                        updatedAt: new Date().toISOString(),
                    }
                })
                break;
            }
            case 'POST': {
                const { body, createdBy, epId, userId } = res
                await prismadb.comment.create({
                    data: {
                        epId,
                        body,
                        userId,
                        createdBy,
                        updatedAt: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                    }
                })
            }
        }
        return new Response(JSON.stringify(res), { status: 200 })
    } catch (err) {
        return handleError(err)
    }
}


