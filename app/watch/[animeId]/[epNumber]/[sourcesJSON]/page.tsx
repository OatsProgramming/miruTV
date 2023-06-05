import Card from "@/app/components/Card/Card";
import HLSPlayer from "@/app/components/HLSPlayer/HLSPlayer";
import enimeFetcher from "@/lib/fetchers/enimeFetcher";
import enimeFetcherToy from "@/lib/toyData/enimeFetcherToy";
import styles from './page.module.css'
import CommmentsSection from "@/app/components/commentsSection/CommentsSection";

export async function generateMetadata({ params: { animeId, epNumber } }: {
    params: {
        animeId: string,
        epNumber: string,
    }
}) {
    const anime = await enimeFetcherToy({ route: 'anime', arg: animeId })
    if (!anime) throw new Error("Anime not found")

    const episodes = anime.episodes
    const curEp = episodes.find((_, idx) => (idx + 1) === Number(epNumber))
    if (!curEp) throw new Error("Episode not found")

    return {
        title: `Watch now: ${anime.title.english} ${curEp?.title}`,
        description: curEp.description
    }
}

export default async function Page({ params: { animeId, epNumber, sourcesJSON } }: {
    params: {
        animeId: string,
        epNumber: string,
        sourcesJSON: string,
    }
}) {
    const sources: AnimeSourcePlain[] = JSON.parse(decodeURIComponent(sourcesJSON))

    const anime = await enimeFetcherToy({ route: 'anime', arg: animeId })
    if (!anime) throw new Error("Anime not found")

    const episodes = anime.episodes

    // Use the index; it'll be quicker (create a binary search fn later: some animes have too many episodes)
    // Add one to index since it always start at 0
    const curEp = episodes.find((_, idx) => (idx + 1) === Number(epNumber))
    if (!curEp) throw new Error("Current episode not found")

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <h1>{curEp.title}</h1>
                <h2>{anime?.title.english}</h2>
                <HLSPlayer
                    sources={sources}
                    poster={curEp.image}
                />
            </div>
            <div className={styles['episodes']}>
                {episodes && (
                    episodes.map((ep, idx) => (
                        <div
                            key={ep.id}
                            className={`
                                ${styles['card']}
                                ${(idx + 1) === Number(epNumber) && styles['selected']}
                            `}
                        >
                            <Card
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
                        </div>
                    ))
                )}
            </div>
            <CommmentsSection epId={curEp.id}/>
        </div>
    )
}