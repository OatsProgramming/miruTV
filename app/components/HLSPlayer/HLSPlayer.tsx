'use client'

import enimeFetcher from '@/lib/fetchers/enimeFetcher'
import Player from '@oplayer/core'
import type { PlayerPlugin } from '@oplayer/core'
import ui from '@oplayer/ui'
import type { UiConfig } from '@oplayer/ui'
import { useEffect, useRef, useState } from 'react'


export default function HLSPlayer({ sources, poster }: {
    sources: AnimeSourcePlain[],
    poster?: string
}) {
    const player = useRef<Player>()
    const divRef = useRef<HTMLDivElement>(null)
    const [hls, setHls] = useState<PlayerPlugin>()
    const [src, setSrc] = useState('')

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
                        .then((res: EnimeSourceHSL) => setSrc(res?.url ?? ''))
                        .catch(err => console.error(err))
                }
            }
        ]
    }

    // Set initial src
    useEffect(() => {
        enimeFetcher({ route: 'source', arg: sources[0].id })
            .then((res: EnimeSourceHSL) => setSrc(res?.url ?? ''))
            .catch(err => console.error(err))
    }, [])

    // Create hlsPlayer
    useEffect(() => {
        const div = divRef.current
        if (!div) return
        import('@/lib/hslPlayer/hls')
            .then(mod => setHls(mod.default))
            .then(_ => {
                if (!div || !hls) return
                player.current = Player.make(divRef.current)
                    .use([ui(uiOptions), hls])
                    .create()
            })
    }, [divRef.current])

    // Set hlsPlayer's src initial & change
    useEffect(() => {
        const hlsPlayer = player.current
        if (!hlsPlayer || !src) return
        hlsPlayer.changeSource({ src })
            .catch(err => console.error(err))
    }, [src])

    return (
        <div ref={divRef} />
    )
}