'use client'

import enimeFetcher from '@/lib/fetchers/enimeFetcher'
import Player from '@oplayer/core'
import type { PlayerPlugin } from '@oplayer/core'
import ui from '@oplayer/ui'
import type { UiConfig } from '@oplayer/ui'
import { useEffect, useRef, useState } from 'react'
import styles from './hlsPlayer.module.css'
import extractDomainName from '@/lib/extractWebName'

export default function HLSPlayer({ sources, poster }: {
    sources: EnimeView['sources'],
    poster?: string,
}) {
    const divRef = useRef<HTMLDivElement>(null)
    const [src, setSrc] = useState('')
    const [hls, setHls] = useState<PlayerPlugin>()
    const [player, setPlayer] = useState<Player>()
    const [srcIdx, setSrcIdx] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const uiOptions: UiConfig = {
        menu: [
            {
                name: 'Source',
                children: sources.map((source, idx) => ({
                    name: extractDomainName(source.url) ?? 'Unknown',
                    default: idx === 0,
                    value: source.id
                })),
                onChange: ({ value }) => {
                    setSrcIdx(sources.findIndex(source => source.id === value))
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

    // Create hlsPlayer (only)
    useEffect(() => {
        const div = divRef.current
        if (!div || !hls) return

        // Make sure that it doesnt create more than one player
        if (!player) {
            // console.log('asd')
            // Also avoid infinite loop
            setPlayer(_ =>
                Player.make(div, { source: { src, poster } })
                    .use([ui(uiOptions), hls])
                    .create()
            )
        }
    }, [divRef.current, hls, player])

    useEffect(() => {
        // console.log('asd')
        enimeFetcher({ route: 'source', arg: sources[srcIdx].id })
            .then(res => res && setSrc(res.url))
            .catch(err => console.log(err))
    }, [srcIdx])

    useEffect(() => {
        // Only care after player has loaded (dont add it as a dependency)
        if (!player) return
        // console.log('asd')
        player.changeSource({ src })
            // .then(_ => console.log('asd'))
            .catch(err => console.log(err))
    }, [src])

    return (
        <div className={`${isLoading && styles['isLoading']}`}>
            {/* Transition softly to actual video content */}
            {/* To prevent 'flashing' event when video has loaded */}
            <div ref={divRef} onLoadedData={() => isLoading && setIsLoading(false)}/>
        </div>
    )
}