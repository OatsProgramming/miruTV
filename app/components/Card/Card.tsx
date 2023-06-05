import Link from 'next/link'
import styles from './card.module.css'
import type { CSSProperties } from 'react'
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

    let epTitle;
    let link = `/info/${animeId}`
    if (epInfo) {
        const { number } = epInfo
        link = `/watch/${animeId}/${number}`

        epTitle = epInfo.title ?? '???'
    }

    return (
        <Link href={link}>
            <div 
                className={`
                    ${styles['card']} 
                    ${isLandScape && styles['epCard']}`
                }
                style={{
                    '--img': `url(${coverImg})`
                } as CSSProperties}>
                <div className={styles['text']}>
                    {epInfo && (
                        <h3>EP {epInfo.number}: {epTitle}</h3>
                    )}
                    {!isLandScape && <h2>{animeTitle}</h2>}
                </div>
            </div>
        </Link>
    )
}