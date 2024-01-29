'use client'

import { useState, useEffect } from "react"
import baseUrl from "./baseUrl"

/**
 * This is to deal w/ scenarios where anilist returns an empty array for episodes
 * @param epId 
 * @param animeInfo 
 * @returns 
 */
export default function getTotalEpisodes(epId: string, animeInfo: IAnimeInfo) {
    const [totalEpisodes, setTotalEpisodes] = useState(animeInfo.nextAiringEpisode?.episode ?? 0)

    const gogoanimeId = epId.includes('-episode')
        ? epId.substring(0, epId.lastIndexOf('-episode'))
        : epId

    const controller = new AbortController()
    useEffect(() => {
        (async () => {
            if (totalEpisodes) return

            try {
                const res = await fetch(`${baseUrl}/api/anime/missingEpisodes/${gogoanimeId}`, {
                    signal: controller.signal
                })
                if (!res.ok) {
                    throw new Error("Failed to fetch episodes")
                }
                const result = await res.json() as IAnimeInfoFiltered
                setTotalEpisodes(result.episodes.length)
                
            } catch (err) {
                console.error((err as Error).message)
            }

        })()
        
        return () => {
            controller.abort()
        }
    }, [])
    return totalEpisodes
}