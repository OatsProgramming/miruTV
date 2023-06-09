'use client'

import Link from 'next/link'
import styles from './card.module.css'
import { CSSProperties, PointerEvent, RefObject, useRef } from 'react'
import { useEffect } from 'react'
import { getDialogContext } from '../DialogProvider.tsx/DialogProvider'
import toggleDialog from '@/lib/toggleDialog'

/**
 * 
 * If given epInfo, Card type change as a whole
 * 
 */
export default function Card({ info, epInfo, isLandScape, style }: {
    info: InfoCard,
    epInfo?: EpCardRequirments,
    isLandScape?: true,
    style?: CSSProperties,
}) {
    const dialogRef = getDialogContext()
    const divRef = useRef<HTMLDivElement>()
    const { animeId, animeTitle, coverImg } = info

    let epTitle;
    let link = `/info/${animeId}`
    if (epInfo) {
        const { number } = epInfo
        link = `/watch/${animeId}/${number}`

        epTitle = epInfo.title ?? '???'
    }

    useEffect(() => {
        function onResize() {
            if (!window) return

            console.log(window.innerHeight)
            console.log(window.innerWidth)
        }

        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [])

    return (
        <Link href={link}>
            <div
                onPointerDown={(e) => dialogRef && setTimeout(() => toggleDialog(e, dialogRef), 300)}
                className={`
                    ${styles['card']} 
                    ${isLandScape && styles['epCard']}`
                }
                style={{
                    '--img': `url(${coverImg})`,
                    ...style
                } as CSSProperties}>
                <div
                    className={styles['text']}
                    style={{
                        display: animeTitle ? '' : 'none'
                    }}
                >
                    {epInfo && (
                        <h3>EP {epInfo.number}: {epTitle}</h3>
                    )}
                    {!isLandScape && <h2>{animeTitle}</h2>}
                </div>
            </div>
        </Link>
    )
}