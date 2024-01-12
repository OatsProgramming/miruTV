import { notFound } from "next/navigation"
import styles from './page.module.css'
import Card from "@/app/components/Card/Card"
import FavId from "@/app/components/FavId/FavId"
import { getServerSession } from "next-auth/next"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import animeFetcher from "@/app/util/animeFetcher/animeFetcher"
import getAnimeTitle from "@/app/util/getAnimeTitle"

export async function generateMetadata({ params: { animeId } }: {
    params: {
        animeId: string,
    }
}) {
    const anime = await animeFetcher({ route: 'info', arg: animeId })
    if (!anime) notFound()

    const title = getAnimeTitle(anime.title)

    return {
        title,
        description: anime.description
    }
}

export default async function Page({ params: { animeId } }: {
    params: {
        animeId: string
    }
}) {
    const animePromise = animeFetcher({ route: 'info', arg: animeId })
    const sessionPromise = getServerSession(authOptions)

    const [session, anime] = await Promise.all([sessionPromise, animePromise])
    if (!anime) notFound()

    const episodes = anime.episodes
    const title = getAnimeTitle(anime.title)

    return (
        <div className={styles['container']}>
            {/* TODO: Bring this back once anilist is back online */}
            {/* <div className={styles['banner']}>
                <img
                    loading="lazy"
                    src={anime.cover}
                    alt={title}
                    width={950}
                    height={200}
                />
            </div> */}
            <section className={styles['info']}>
                <Card
                    info={{
                        animeId: anime.id,
                        animeTitle: '',
                        coverImg: anime.image
                    }}
                />
                <h1>{title}</h1>
                <div>{anime.description}</div>
                <FavId animeId={animeId} favIds={session?.user.favIds} />
            </section>
            <section className={styles['episodes']}>
                {episodes && episodes.map(ep => (
                    <Card
                        key={ep.id}
                        info={{
                            animeId: anime.id,
                            animeTitle: title,
                            coverImg: ep.image
                        }}
                        epInfo={{
                            epId: ep.id,
                            title: ep.title ?? 'N/A',
                            number: ep.number
                        }}
                        isLandScape
                    />
                ))}
            </section>
        </div>
    )
}