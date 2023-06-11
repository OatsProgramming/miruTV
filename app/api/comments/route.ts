import prismadb from "@/lib/prismadb";
import handleError from "@/lib/handleError";
import validateRequest from "./validateRequest";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const epId = searchParams.get('epId')
        const repliedTo = searchParams.get('repliedTo')
        if (!epId && !repliedTo) {
            return new Response(
                `For Comments, you must either give: comment ID (repliedTo) or episode ID. None of those were given.`,
                { status: 422 }
            )
        }

        let toReturn;
        if (epId) {
            toReturn = await prismadb.comment.findMany({
                where: { epId }
            })
        }
        else {
            toReturn = await prismadb.comment.findMany({
                where: { repliedTo }
            })
        }

        return new Response(JSON.stringify(toReturn), { status: 200 })
    } catch (err) {
        return handleError(err)
    }
}

export async function POST(req: Request) {
    const res = await validateRequest(req)
    if (res instanceof Response) return res

    try {
        switch (res.method) {
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
                const copy = { ...res }
                delete copy.method
                await prismadb.comment.create({
                    // Despite checking everything, still gives type error
                    // @ts-expect-error
                    data: {
                        ...copy,
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


