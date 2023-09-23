'use client'

import Player from '@oplayer/core'
import type { MenuBar } from '@oplayer/ui'
import { useEffect, useRef, useState } from 'react'
import styles from './oPlayer.module.css'
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

// TODO: add different provider menu btn

export default function OPlayer({ sourcesPromise }: {
  sourcesPromise: Promise<AnimeSourcesResult | undefined> 
}) {  
  const playerRef = useRef<Player<Ctx>>()
  const [sources, setSources] = useState<IVideo[]>()

  // Added this fn to handle promise related issue for OPlayer (required)
  function getSelectedSrc(selectedQuality: string): Promise<IVideo> {
    return new Promise((resolve, reject) => {
      const selectedSrc = sources!.find(src => src.quality === selectedQuality) as IVideo
      if (!selectedSrc) reject("Selected quality source not found")
      resolve(selectedSrc)
    })
  }

  // #oplayer element has rendered, just create player
  useEffect(() => {
    // Also have the promise resolved in order to actually see something
    if (!sourcesPromise) return
    sourcesPromise.then(res => res 
      ? setSources(res.sources)  
      : notFound()
    )

    playerRef.current =
      Player.make('#oplayer')
        .use(plugins)
        .create() as Player<Ctx>

    return () => {
      playerRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    const oplayer = playerRef.current
    if (!oplayer || !sources) return

    const { menu } = oplayer.context.ui

    // Menu bar for OPlayer
    const menuBar: MenuBar = {
      name: 'Quality',
      children: sources.map((source) => ({
        name: source.quality,
        value: source.quality,
        default: source.quality === 'default',
      })),
      onChange: ({ value }) => {
        if (!playerRef.current) return
  
        playerRef.current
          .changeSource(
            getSelectedSrc(value)
              .then((res) => res
                ? ({ src: res.url })
                : notFound()) // This should never occur btw
          )
          .catch((err) => console.log(err))
      }
    }
  

    // Note: If sources has changed, we need to delete the old one before re-registering
    menu.unregister('Source')
    menu.register(menuBar)

    //play default id
    oplayer.changeSource(
      getSelectedSrc('default')
        .then((res) => res
          ? ({ src: res.url })
          : notFound()) // this should never occur
    )
      .catch((err) => console.log(err))
  }, [sources, playerRef.current])

  return (
    // No loading is required, it is also the default
    <div id="oplayer" className={styles['oplayer']} />
  )
}