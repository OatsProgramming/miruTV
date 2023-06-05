import Link from 'next/link'
import styles from './card.module.css'
/**
 * 
 * If given epInfo, Card type change as a whole
 * 
 */

export default function Card({ info, epInfo, isLandScape }: {
    info: InfoCard,
    epInfo?: EpCardRequirments,
    isLandScape?: true
}) {
    const { animeId, animeTitle, coverImg } = info
    let link = `/info/${animeId}`

    if (epInfo) {
        const { sources, number } = epInfo
        const sourcesJSON = encodeURIComponent(JSON.stringify(sources))
        link = `/watch/${animeId}/${number}/${sourcesJSON}`
    }
    
    return (
        <Link href={link}>
            <div className={`${styles['card']} ${isLandScape && styles['epCard']}`}>
                <img
                    loading='lazy'
                    src={coverImg}
                />
                {epInfo && (
                    <h3>EP {epInfo.number}: {epInfo.title ?? 'N/A'}</h3>
                )}
                {!isLandScape && <h2>{animeTitle}</h2>}
            </div>
        </Link>
    )
}