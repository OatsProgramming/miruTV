import { notFound } from "next/navigation"
import enimeFetcherToy from "@/lib/toyData/enimeFetcherToy"

export default async function Page({ params: { animeId} }: {
    params: {
        animeId: string
    }
}) {

    const anime = await enimeFetcherToy({ route: 'anime', arg: animeId })
    if (!anime) notFound()

    const episodes = anime.episodes
    return (
        <div>
            <div>
                {anime.title.english}
            </div>
            {episodes.map(ep => (
                <div key={ep.id}>
                    <div>
                        {ep.title}
                    </div>
                </div>
            ))}
        </div>
    )
}