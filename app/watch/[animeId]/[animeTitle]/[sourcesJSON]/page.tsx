import Card from "@/app/components/Card/Card";
import HLSPlayer from "@/app/components/HLSPlayer/HLSPlayer";
import enimeFetcher from "@/lib/fetchers/enimeFetcher";

export default async function Page({ params: { animeId, animeTitle, sourcesJSON } }: {
    params: {
        animeId: string,
        animeTitle: string,
        sourcesJSON: string,
    }
}) {
    const titleDecoded = decodeURIComponent(animeTitle)
    const sources: AnimeSourcePlain[] = JSON.parse(decodeURIComponent(sourcesJSON))

    const anime = await enimeFetcher({ route: 'anime', arg: animeId })
    const episodes = anime?.episodes

    return (
        <div>
            {/* <HLSPlayer
                sources={sources}
            // poster={src.}
            /> */}
            <div>{titleDecoded}</div>
            {episodes && (
                episodes.map(ep => (
                    <Card 
                        key={ep.id}
                        info={{
                            animeId: anime.id,
                            animeTitle: anime.title.english,
                            coverImg: ep.image ?? anime.bannerImage
                        }}
                        epInfo={{
                            title: ep.title,
                            number: ep.number,
                            sources: ep.sources
                        }}
                        isLandScape
                    />
                ))
            )}

        </div>
    )
}