import { NextResponse } from "next/server";
import { gogo } from "@/lib/consumet/anime";

export async function GET(req: Request) {
    try {
        // TODO: add redis
        const recents = await gogo.fetchRecentEpisodes()

        return NextResponse.json(recents)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}