import getAnimeTitle from '@/app/util/getAnimeTitle'
import Card from '@/app/components/Card/Card'
import styles from '../../[epId]/page.module.css'

export default async function Episodes({ animeInfoPromise, epId }: {
    animeInfoPromise: Promise<AnimeInfoResult>,
    epId: string,
}) {
    const animeInfo = await animeInfoPromise
    const episodes = animeInfo.episodes ?? []

    return (
        <div className={styles['episodes']}>
            {episodes.length > 0 && (
                episodes.map((ep) => {
                    console.log(ep)
                    return (
                        <div
                            key={ep.id}
                            className={`
                                        ${styles['card']}
                                        ${ep.id === epId && styles['selected']}
                                    `}
                        >
                            <Card
                                info={{
                                    animeId: animeInfo.id,
                                    animeTitle: getAnimeTitle(animeInfo.title),
                                    coverImg: ep.image
                                }}
                                epInfo={{
                                    title: ep.title || 'N/A',
                                    number: ep.number,
                                    epId: ep.id
                                }}
                                isLandScape
                            />
                        </div>
                    )
                })
            )}
        </div>
    )
}