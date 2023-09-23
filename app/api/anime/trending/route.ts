import anilist from "@/lib/consumet/anilist";
import { NextResponse } from "next/server";
import lessenPayload from "../lessenPayload";

export async function GET(req: Request) {
    try {
        const trending = await anilist.fetchTrendingAnime()
        lessenPayload(trending)
        return NextResponse.json(trending)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}