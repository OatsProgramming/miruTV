'use client'

import baseUrl from "@/app/util/baseUrl"
import styles from './episodesBackup.module.css'
import Link from "next/link"
import getTotalEpisodes from "@/app/util/getTotalEpisodes"

export default function EpisodesBackup({ animeInfo, epId }: {
    animeInfo: IAnimeInfoFiltered,
    epId: string
}) {

    // ex: tsuki-ga-michibiku-isekai-douchuu-2nd-season
    if (!epId.includes('episode')) {
        epId += '-episode-'
    }

    // ex: dosanko-gal-wa-namara-menkoi-episode-1 ---> dosanko-gal-wa-namara-menkoi-episode-
    const i = epId.lastIndexOf('-') + 1
    epId = epId.substring(0, i)

    const totalEpisodes = getTotalEpisodes(epId, animeInfo)

    const elements = []
    for (let i = 1; i <= totalEpisodes; i++) {
        const newEpId = epId + i
        elements.push(
            <Link key={newEpId} className={styles['button']} href={`${baseUrl}/watch/${newEpId}`}>
               {i}
            </Link>
        )
    }

    return (
        <div className={styles['container']}>
            <h1>
                EPISODES
            </h1>
            <div className={styles['episodes']}>
                {elements}
            </div>
        </div>
    )
}