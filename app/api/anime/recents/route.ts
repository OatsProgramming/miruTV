import { NextResponse } from "next/server";
import { gogo } from "@/lib/consumet/anime";
import lessenPayload from "../lessenPayload";
import redis from "@/lib/redis";


export async function GET(req: Request) {
    try {
        // Check cache
        const cachedVal = await redis.get('recents')
        if (cachedVal) {
            console.log("ANIME RECENTS HIT")
            return new Response(cachedVal)
        }
        
        const recents = await gogo.fetchRecentEpisodes()
        lessenPayload(recents)

        // Cache if nonexistent in redis
        const stringifyResult = JSON.stringify(recents)
        await redis.setex('recents', 3600, stringifyResult)
        console.log("ANIME RECENTS MISS")

        return NextResponse.json(recents)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}