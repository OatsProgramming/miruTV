import anilist from "@/lib/consumet/anilist";
import { NextResponse } from "next/server";
import lessenPayload from "../lessenPayload";

export async function GET(req: Request) {
    try {
        // TODO: add redis
        // TODO: lessen payload
        const popular = await anilist.fetchPopularAnime()
        lessenPayload(popular)
        return NextResponse.json(popular)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}