import anilist from "@/lib/consumet/anilist";
import { gogo } from "@/lib/consumet/anime";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // TODO: add redis
        // TODO: lessen payload
        const popular = await anilist.fetchPopularAnime()

        return NextResponse.json(popular)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}