import Card from '@/app/components/Card/Card'
import styles from './recommendations.module.css'
import getAnimeTitle from '@/app/util/getAnimeTitle'

export default function Recommendations({ recommendations }: {
    recommendations: IAnimeInfoFiltered['recommendations']
}) {
    if (!recommendations) return <></>

    return (
        <section className={styles['container']}>
            <h1>Craving <span> More?</span> We Got You: </h1>
            <div className={styles['recommendations']}>
                {recommendations.map(anime => (
                    <Card
                        key={anime.id}
                        info={{
                            animeId: anime.id,
                            animeTitle: getAnimeTitle(anime.title),
                            coverImg: anime.image ?? anime.cover
                        }}
                    />
                ))}
            </div>
        </section>
    )
}