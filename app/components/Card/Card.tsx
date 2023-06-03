import Link from 'next/link'
import styles from './card.module.css'

export default function Card({ coverImg, animeTitle, epTitle, epNumber, sources, animeId }: {
    coverImg: string,
    animeTitle: string,
    epTitle?: string,
    epNumber?: number,
    // recentList
    sources?: AnimeSourcePlain[],
    // popularList
    animeId?: string,
}) {
    const sourcesJSON = encodeURIComponent(JSON.stringify(sources))
    const link = sources ? `/watch/${sourcesJSON}` : `/`

    return (
        <Link href={link}>
            <div className={styles['card']}>
                <img
                    loading='lazy'
                    src={coverImg}
                />
                {epNumber && (
                    <h3>EP {epNumber}: {epTitle ?? 'N/A'}</h3>
                )}
                <h2>{animeTitle}</h2>
            </div>
        </Link>
    )
}