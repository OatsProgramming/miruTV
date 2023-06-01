'use client'

import Player from '@oplayer/core'
import type { PlayerPlugin } from '@oplayer/core'
import ui from '@oplayer/ui'
import { useEffect, useRef, useState } from 'react'

export default function HLSPlayer({ src, poster }: {
    src: string,
    poster: string
}) {
    const divRef = useRef<HTMLDivElement>(null)
    const [hls, setHls] = useState<PlayerPlugin>()

    useEffect(() => {
        const div = divRef.current
        import('@/lib/hslPlayer/hls')
            .then(mod => setHls(mod.default))
            .then(_ => {
                if (!div || !hls) return
                Player.make(divRef.current, {
                    source: { src, poster }
                })
                    .use([ui(), hls])
                    .create()
            })

    }, [divRef.current])

    return (
        <div ref={divRef} />
    )
}