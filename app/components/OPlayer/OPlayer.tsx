'use client'

import enimeFetcher from '@/lib/fetchers/enimeFetcher'
import Player from '@oplayer/core'
import type { PlayerOptions } from '@oplayer/core'
import type { MenuBar } from '@oplayer/ui'
import { useEffect, useRef } from 'react'
import styles from './hlsPlayer.module.css'
import extractDomainName from '@/lib/extractWebName'
import { notFound } from 'next/navigation'
import OUI from '@oplayer/ui'
import OHls from '@oplayer/hls'

// To deal with "any" type for context object
type Ctx = {
  ui: ReturnType<typeof OUI>
  hls: ReturnType<typeof OHls>
}

// static， no-render, no-memo
const plugins = [
  OUI(),
  // Don't worry, the default is lazy loading
  OHls(),
]

export default function OPlayer({ sources, poster }: {
  sources: EnimeView['sources'],
  poster?: string,
}) {
  const playerRef = useRef<Player<Ctx>>()

  const menuBar: MenuBar = {
    name: 'Source',
    children: sources.map((source, idx) => ({
      name: extractDomainName(source.url) || 'Unknown',
      default: idx === 0,
      value: source.id
    })),
    onChange: ({ value }) => {
      if (!playerRef.current) return
      playerRef.current
        .changeSource(
          enimeFetcher({ route: 'source', arg: value })
            .then((res) => res 
              ? ({ src: res.url, poster }) 
              : notFound())
        )
        .catch((err) => console.log(err))
    }
  }

  // #oplayer element has rendered, just create player
  useEffect(() => {
    playerRef.current =
      Player.make('#oplayer', { poster } as PlayerOptions)
        .use(plugins)
        .create() as Player<Ctx>

    return () => {
      playerRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    const oplayer = playerRef.current
    if (!oplayer) return
    const { menu } = oplayer.context.ui

    // Note: If sources has changed, we need to delete the old one before re-registering
    menu.unregister('Source')
    menu.register(menuBar)

    //play default id
    oplayer.changeSource(
      enimeFetcher({ route: 'source', arg: sources[0].id })
        .then((res) => res
          ? ({ src: res.url, poster })
          : notFound())
    )
      .catch((err) => console.log(err))
  }, [sources, playerRef.current])

  return (
    // No loading is required, it is also the default
    <div id="oplayer" className={styles['oplayer']} />
  )
}