import { notFound } from "next/navigation"
import styles from './page.module.css'
import Card from "@/app/components/Card/Card"
import FavId from "@/app/components/FavId/FavId"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import enimeFetcher from "@/lib/fetchers/enimeFetcher"
import Image from "next/image"

export async function generateMetadata({ params: { animeId } }: {
    params: {
        animeId: string,
    }
}) {
    const anime = await enimeFetcher({ route: 'anime', arg: animeId })
    if (!anime) notFound()

    return {
       title: anime.title.english,
       description: anime.description
    }
} 

export default async function Page({ params: { animeId } }: {
    params: {
        animeId: string
    }
}) {
    const sessionPromise = getServerSession(authOptions)
    const animePromise = enimeFetcher({ route: 'anime', arg: animeId })

    const [session, anime] = await Promise.all([sessionPromise, animePromise])
    if (!anime) notFound()

    const episodes = anime.episodes
    return (
        <div className={styles['container']}>
            <div className={styles['banner']}>
                <Image
                    src={anime.bannerImage}
                    alt={anime.title.english ?? '???'}
                    width={950}
                    height={200}
                />
            </div>
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
                <FavId animeId={animeId} favIds={session?.user.favIds}/>
            </section>
            <section className={styles['episodes']}>
                {episodes.map(ep => (
                    <Card
                        key={ep.id}
                        info={{
                            animeId: anime.id,
                            animeTitle: anime.title.english ?? 'N/A',
                            coverImg: ep.image
                        }}
                        epInfo={{
                            number: ep.number,
                            title: ep.title,
                        }}
                        isLandScape
                    />
                ))}
            </section>
        </div>
    )
}