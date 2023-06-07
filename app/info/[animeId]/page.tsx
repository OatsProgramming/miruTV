import { notFound } from "next/navigation"
import enimeFetcherToy from "@/lib/toyData/enimeFetcherToy"
import styles from './page.module.css'
import Card from "@/app/components/Card/Card"

export default async function Page({ params: { animeId } }: {
    params: {
        animeId: string
    }
}) {

    const anime = await enimeFetcherToy({ route: 'anime', arg: animeId })
    if (!anime) notFound()

    const episodes = anime.episodes
    return (
        <div className={styles['container']}>
            <img
                className={styles['banner']}
                loading='lazy'
                src={anime.bannerImage}
            />
            <section className={styles['info']}>
                <Card
                    info={{
                        animeId: anime.id,
                        animeTitle: '',
                        coverImg: anime.coverImage
                    }}
                />
                <h1>
                    {anime.title.english}
                </h1>
                <div>
                    {anime.description}
                </div>
                <div>
                    
                </div>
            </section>
            <section className={styles['episodes']}>
                {episodes.map(ep => (
                    <Card
                        key={ep.id}
                        info={{
                            animeId: anime.id,
                            animeTitle: anime.title.english,
                            coverImg: ep.image ?? anime.bannerImage
                        }}
                        epInfo={{
                            number: ep.number,
                            title: ep.title,
                            sources: ep.sources
                        }}
                        isLandScape
                    />
                ))}
            </section>
        </div>
    )
}