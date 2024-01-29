import { notFound } from "next/navigation"
import styles from './page.module.css'
import Card from "@/app/components/Card/Card"
import FavId from "@/app/components/FavId/FavId"
import { getServerSession } from "next-auth/next"
import authOptions from "@/app/api/auth/[...nextauth]/options"
import animeFetcher from "@/app/util/animeFetcher/animeFetcher"
import getAnimeTitle from "@/app/util/getAnimeTitle"
import Countdown from "../../components/Countdown/Countdown"
import Episodes from "@/app/watch/components/Episodes/Episodes"
import EpisodesBackup from "@/app/watch/components/EpisodesBackup/EpisodesBackup"
import toGogoId from "@/app/util/toGogoId"

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

    const [title, forGogo] = [getAnimeTitle(anime.title)!, getAnimeTitle(anime.title, 'romaji')!]
    const banner = anime.artwork?.filter(art => art.type === 'banner')[0] ?? {}

    const gogoId = toGogoId(forGogo)

    return (
        <div className={styles['container']}>
            <div className={styles['banner']}>
                <img
                    loading="lazy"
                    src={'img' in banner
                        ? banner.img as string
                        : anime.cover
                    }
                    alt={title}
                    width={950}
                    height={200}
                />
            </div>
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
                <div className={styles['trailer']}>
                    <iframe src={`https://www.youtube.com/embed/${anime.trailer?.id}`} allowFullScreen />
                </div>
                <FavId animeId={animeId} favIds={session?.user.favIds} />
            </section>
            <section className={styles['episodes']}>
                {anime.episodes.length > 0
                    ? <Episodes epId={gogoId} animeInfo={anime}/>
                    : <EpisodesBackup epId={gogoId} animeInfo={anime}/>
                }
            </section>
            <section className={styles['countdown']}>
                <Countdown
                    animeStatus={anime.status}
                    nextAiringEpisode={anime.nextAiringEpisode}
                />
            </section>
        </div>
    )
}