'use client'

import Link from 'next/link'
import styles from './card.module.css'
import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
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
    
    const { animeId, animeTitle, coverImg } = info

    const epTitle = epInfo?.title ?? '???'
    const link = epInfo ? `/watch/${animeId}/${epInfo.number}` : `/info/${animeId}`

    return (
        <Link href={link}>
            <div
                onPointerDown={(e) => dialogRef && setTimeout(() => toggleDialog(e, dialogRef), 300)}
                className={`
                    ${styles['card']} 
                    ${isLandScape && styles['epCard']}
                    ${dialogRef && styles['dialogCard']}
                `}
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