import anilist from "@/lib/consumet/anilist";
import { NextResponse } from "next/server";
import lessenPayload from "../lessenPayload";
import redis from "@/lib/redis";

export async function GET(req: Request) {
    try {
        // Check cache
        const cachedVal = await redis.get('popular')
        if (cachedVal) {
            console.log("ANIME POPULAR HIT")
            return new Response(cachedVal)
        }

        const popular = await anilist.fetchPopularAnime()
        lessenPayload(popular)

        // Cache if nonexistent in redis
        const stringifyResult = JSON.stringify(popular)
        await redis.setex('popular', 3600, stringifyResult)
        console.log("ANIME POPULAR MISS")

        return NextResponse.json(popular)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}