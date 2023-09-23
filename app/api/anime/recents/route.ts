import { NextResponse } from "next/server";
import { gogo } from "@/lib/consumet/anime";
import lessenPayload from "../lessenPayload";


export async function GET(req: Request) {
    try {
        // TODO: add redis
        const recents = await gogo.fetchRecentEpisodes()
        lessenPayload(recents)

        return NextResponse.json(recents)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}