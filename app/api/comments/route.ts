import prismadb from "@/lib/prismadb";
import handleError from "@/lib/handleError";
import validateRequest from "./validateRequest";
import commentsToy from "@/lib/toyData/commentToy";
import redis from "@/lib/redis";

export async function GET(req: Request) {
    const defaultTTL = 30

    try {
        const { searchParams } = new URL(req.url)
        const epId = searchParams.get('epId')
        const repliedTo = searchParams.get('repliedTo')
        const query = epId ? epId : repliedTo
        if (!query) {
            return new Response(
                `For Comments, you must either give: comment ID (repliedTo) or episode ID. None of those were given.`,
                { status: 422 }
            )
        }

        // Check redis first before db
        const cachedCommments = await redis.get(query)
        if (cachedCommments) {
            console.log('COMMENT CACHE HIT')
            return new Response(cachedCommments, { status: 200 })
        }

        const comments = await prismadb.comment.findMany({
            where: {
                OR: [{ epId }, { repliedTo }]
            }
        })
        
        // Cache if not there
        const stringifyComments = JSON.stringify(comments)
        redis.setex(query, defaultTTL, stringifyComments)
        console.log('COMMENT CACHE MISS')

        return new Response(stringifyComments, { status: 200 })
    } catch (err) {
        return handleError(err)
    }
}

export async function POST(req: Request) {
    const res = await validateRequest(req)
    if (res instanceof Response) return res

    // Not sure how im going to do this with redis. Figure out when possible
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


