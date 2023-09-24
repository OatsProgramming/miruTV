import anilist from "@/lib/consumet/anilist";
import { NextResponse } from "next/server";
import lessenPayload from "../lessenPayload";
import redis from "@/lib/redis";

export async function GET(req: Request) {
    try {
        // Check cache
        const cachedVal = await redis.get('trending')
        if (cachedVal) {
            console.log("ANIME TRENDING HIT")
            return new Response(cachedVal)
        }
        
        const trending = await anilist.fetchTrendingAnime()
        lessenPayload(trending)

        // Cache if nonexistent in redis
        const stringifyResult = JSON.stringify(trending)
        await redis.setex('trending', 3600, stringifyResult)
        console.log("ANIME TRENDING MISS")

        return NextResponse.json(trending)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}