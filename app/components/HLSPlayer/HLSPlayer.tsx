'use client'

import enimeFetcher from '@/lib/fetchers/enimeFetcher'
import Player from '@oplayer/core'
import type { PlayerPlugin } from '@oplayer/core'
import ui from '@oplayer/ui'
import type { UiConfig } from '@oplayer/ui'
import { useEffect, useRef, useState } from 'react'
import styles from './hlsPlayer.module.css'


export default function HLSPlayer({ sources, poster }: {
    sources: AnimeSourcePlain[],
    poster?: string
}) {
    const divRef = useRef<HTMLDivElement>(null)
    const [src, setSrc] = useState('')
    const [hls, setHls] = useState<PlayerPlugin>()
    const [player, setPlayer] = useState<Player>()

    const uiOptions: UiConfig = {
        menu: [
            {
                name: 'Source',
                children: sources.map((source, idx) => ({
                    name: source.website,
                    default: idx === 0,
                    value: source.id
                })),
                onChange: ({ value }) => {
                    enimeFetcher({ route: 'source', arg: value })
                        .then(res => setSrc(res?.url ?? ''))
                        .catch(err => console.error(err))
                }
            }
        ]
    }

    // Set initial src && lazy load hls
    useEffect(() => {
        enimeFetcher({ route: 'source', arg: sources[0].id })
            .then(res => setSrc(res?.url ?? ''))
            .catch(err => console.error(err))
        import('@/lib/hlsPlayer/hls')
            .then(mod => setHls(mod.default))
    }, [])

    // Create hlsPlayer
    useEffect(() => {
        const div = divRef.current
        if (!div || !src || !hls) return

        // Make sure that it doesnt create more than one player
        if (!player) {
            // Also avoid infinite loop
            setPlayer(_ =>
                Player.make(div, { source: { src, poster } })
                    .use([ui(uiOptions), hls])
                    .create()
            )
        } else {
            player.changeSource({ src })
                .catch(err => console.error(err))
        }
    }, [divRef.current, src, hls, player])

    return (
        <div className={styles['']}>
            <div ref={divRef} />
        </div>
    )
}