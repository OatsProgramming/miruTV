import Card from "@/app/components/Card/Card";
import HLSPlayer from "@/app/components/HLSPlayer/HLSPlayer";
import enimeFetcher from "@/lib/fetchers/enimeFetcher";
import styles from './page.module.css'
import CommentsSection from "@/app/components/CommentsSection/CommentsSection";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({ params: { animeId, epNumber } }: {
    params: {
        animeId: string,
        epNumber: string,
    }
}) {
    const episode = await enimeFetcher({ route: 'view', arg1: animeId, arg2: epNumber })
    if (!episode) notFound()

    const { anime } = episode

    return {
        title: `Watch now: ${anime.title.english} ${episode.title}`,
        description: episode.description
    }
}

export default async function Page({ params: { animeId, epNumber } }: {
    params: {
        animeId: string,
        epNumber: string,
    }
}) {
    const episode = await enimeFetcher({ route: 'view', arg1: animeId, arg2: epNumber })
    if (!episode) notFound()

    const { anime } = episode
    const { episodes } = anime

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <h1>EP {epNumber}: {episode.title}</h1>
                <Link href={`/info/${anime.id}`}>
                    <h3>{anime.title.english}</h3>
                </Link>
                <HLSPlayer
                    sources={episode.sources}
                    poster={episode.image}
                />
            </div>
            <div className={styles['episodes']}>
                {episodes.length > 0 && (
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
                                }}
                                isLandScape
                            />
                        </div>
                    ))
                )}
            </div>
            <CommentsSection epId={episode.id} />
        </div>
    )
}