import { gogo } from "@/lib/consumet/anime";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // TODO: add redis
        // TODO: lessen payload
        const popular = await gogo.fetchTopAiring()

        return NextResponse.json(popular)
    } catch (err) {
        return NextResponse.json(err, { status: 500 })
    }
}