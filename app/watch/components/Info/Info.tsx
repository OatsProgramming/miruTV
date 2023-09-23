import getAnimeTitle from "@/app/util/getAnimeTitle"
import Link from "next/link"

export default async function Info({ epId, animeInfoPromise }: {
    epId: string,
    animeInfoPromise: Promise<AnimeInfoResult | undefined>
}) {
    const anime = await animeInfoPromise
    if (!anime) return <></>

    const episode = anime.episodes?.find(ep => ep.id === epId)
    const animeTitle = getAnimeTitle(anime.title)

    return (
        <>
            <h1>EP: {episode?.number} {episode?.title ?? 'N/A'}</h1>
            <Link href={`/info/${anime.id}`}>
                <h3>{animeTitle}</h3>
            </Link>
        </>
    )
}