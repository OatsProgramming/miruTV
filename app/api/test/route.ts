import animeToy from "@/lib/toyData/animeToy"

export async function GET(req: Request) {
    return new Response(JSON.stringify(animeToy))
}