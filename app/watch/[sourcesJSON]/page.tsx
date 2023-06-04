import HLSPlayer from "@/app/components/HLSPlayer/HLSPlayer";

export default async function Page({ params: { sourcesJSON } }: {
    params: {
        sourcesJSON: string,
    }
}) {
    const sources: AnimeSourcePlain[] = JSON.parse(decodeURIComponent(sourcesJSON))
    return (
        <div>
            <HLSPlayer
                sources={sources}
            // poster={src.}
            />
        </div>
    )
}