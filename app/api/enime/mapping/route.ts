import handleError from "@/lib/handleError";
import { handleFetch } from "@/lib/handleFetch";

export async function GET(req: Request) {
    try{
        const { searchParams } = new URL(req.url)
        const providerName = searchParams.get('providerName')
        const providerId = searchParams.get('providerId')
        if (!providerId || !providerName) {
            return new Response(
            `Is missing... 
            Provider ID?:  ${!providerId}
            Provider Name?: ${!providerName}`, 
            { status: 400 })
        }

        return handleFetch(`https://api.enime.moe/mapping/${providerName}/${providerId}`)
    } catch (err) {
        return handleError(err)
    }
}