import Card from '../Card/Card'
import styles from './animeSect.module.css'

/**
 * As of rn, this is for the home pg when user is signed in.
 * Can't make this work with anything else but an EnimeAnime type. (Maybe figure out later)
 */
export default function AnimeSect({ sectName, anime, isInfo }: {
    sectName: string,
    anime: EnimeAnime,
    isInfo?: true
}) {
    const epList = anime.episodes
    return (
        <>
            <h1>{sectName}</h1>
            <section className={styles['animeList']}>
                {epList.map(item => (
                    anime.title.english !== null && (
                        <Card
                            key={item.id}
                            info={{
                                animeId: anime.id,
                                animeTitle: anime.title.english,
                                coverImg: anime.coverImage,
                            }}
                            epInfo={
                                isInfo && {
                                    title: item.title,
                                    number: item.number,
                                    sources: item.sources
                                }
                            }
                        />
                    )
                ))}
            </section>
        </>
    )
}