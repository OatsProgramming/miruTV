'use client'

import Link from 'next/link'
import styles from './card.module.css'
import { CSSProperties, useEffect, useRef } from 'react'
import { getDialogContext } from '../DialogProvider.tsx/DialogProvider'
import toggleDialog from '@/app/util/toggleDialog'
import tempImgs from '@/app/util/tempImgs'

/**
 * 
 * If given epInfo, Card type change as a whole
 * 
 */
export default function Card({ info, epInfo, isLandScape, isSelected, style }: {
    info: InfoCard,
    epInfo?: EpCardRequirments,
    isLandScape?: true,
    isSelected?: boolean,
    style?: CSSProperties,
}) {
    // When card is in a dialog (UserDialog)
    const dialogRef = getDialogContext()
    const divRef = useRef<HTMLDivElement>(null)

    // if an epCard && in /watch, make sure selected card is in view
    useEffect(() => {
        const div = divRef.current
        if (!div) return
        if (isSelected) div.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
        })

    }, [divRef.current, isSelected])

    const { animeId, animeTitle, coverImg } = info

    const epTitle = epInfo?.title ?? '???'
    const link = epInfo
        ? `/watch/${epInfo.epId}`
        : animeId !== 777
            ? `/info/${animeId}`
            : `/`

    const imgSrc = animeId === 777
        ? tempImgs.noSaves
        : coverImg
            ? coverImg
            : tempImgs.noEpImg
    return (
        <Link href={link}>
            <div
                ref={divRef}
                onPointerDown={(e) => dialogRef && setTimeout(() => toggleDialog(e, dialogRef), 300)}
                className={`
                    ${styles['card']} 
                    ${isLandScape && styles['epCard']}
                    ${dialogRef && styles['dialogCard']}
                    ${isSelected && styles['selected']}
                `}
                style={style}>
                <img
                    loading='lazy'
                    src={imgSrc}
                    alt={animeTitle}
                    width={100}
                    height={100}
                />
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