import Card from "@/app/components/Card/Card";
import HLSPlayer from "@/app/components/HLSPlayer/HLSPlayer";
import enimeFetcher from "@/lib/fetchers/enimeFetcher";
import enimeFetcherToy from "@/lib/toyData/enimeFetcherToy";
import styles from './page.module.css'
import CommentsSection from "@/app/components/commentsSection/CommentsSection";

export async function generateMetadata({ params: { animeId, epNumber } }: {
    params: {
        animeId: string,
        epNumber: string,
    }
}) {
    const anime = await enimeFetcherToy({ route: 'anime', arg: animeId })
    if (!anime) throw new Error("Anime not found")

    // Can just get it by index since it's already sorted
    const episodes = anime.episodes
    const epIdx = Number(epNumber) - 1
    const curEp: AnimeEpisode = episodes[epIdx]
    // This should never happen btw if using the ui
    if (!curEp) throw new Error(`Episode ${epIdx} of ${anime.title.english} cannot be found.`)

    return {
        title: `Watch now: ${anime.title.english} ${curEp.title}`,
        description: curEp.description
    }
}

export default async function Page({ params: { animeId, epNumber } }: {
    params: {
        animeId: string,
        epNumber: string,
    }
}) {
    const anime = await enimeFetcherToy({ route: 'anime', arg: animeId })
    if (!anime) throw new Error("Anime not found")

    // Can just get it by index since it's already sorted
    // Note to self: for some reason epNumber goes null sometimes while loading. reason unknown
    const episodes = anime.episodes
    const epIdx = Number(epNumber) - 1
    const curEp = episodes[epIdx]
    // This should never happen btw if using the ui
    if (!curEp) throw new Error(`Episode ${epIdx} of ${anime.title.english} cannot be found.`)

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <h1>{curEp.title}</h1>
                <h2>{anime.title.english}</h2>
                <HLSPlayer
                    sources={curEp.sources}
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
            <CommentsSection epId={curEp.id} />
        </div>
    )
}