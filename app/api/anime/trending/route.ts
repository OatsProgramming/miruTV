import anilist from "@/lib/consumet/anilist";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const trending = await anilist.fetchTrendingAnime()
        return NextResponse.json(trending)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}