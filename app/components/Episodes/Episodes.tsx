import getAnimeTitle from '@/app/util/getAnimeTitle'
import Card from '@/app/components/Card/Card'
import styles from '@/app/watch/[epId]/page.module.css'

// TODO: Instead of episode cards, itd be just a list of numbers

export default function Episodes({ animeInfo, epId }: {
    animeInfo: IAnimeInfoFiltered,
    epId: string,
}) {
    const episodes = animeInfo.episodes ?? []

    return (
        <div className={styles['episodes']}>
            {episodes.length > 0 && (
                episodes.map((ep, i) => {
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
                                    animeTitle: getAnimeTitle(animeInfo.title)!,
                                    coverImg: ep.image
                                }}
                                epInfo={{
                                    title: ep.title || 'N/A',
                                    number: ep.number,
                                    epId: ep.id
                                }}
                                isSelected={ep.id === epId}
                                isLandScape
                            />
                        </div>
                    )
                })
            )}
        </div>
    )
}