'use client'

import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import styles from './searchDialog.module.css'
import toggleDialog from '@/app/util/toggleDialog'
// import enimeFetcher from '@/app/util/fetchers/enimeFetcher'
import AnimeInfo from '../../AnimeInfo/AnimeInfo'
import animeFetcher from '@/app/util/animeFetcher/animeFetcher'

export default function SearchDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const timerRef = useRef<NodeJS.Timeout | undefined>()
    const [searchResults, setSearchResults] = useState<AnimeSearchResult['results']>()
    const animes = searchResults || []

    function getResults(query: string) {
        // Make sure that it doesnt send too many request accidentally
        // Wait till user is finished typing
        timerRef.current = setTimeout(() => {
            animeFetcher({ route: 'search', arg: query })
                .then(res => setSearchResults(res?.results))
                .catch(err => console.error(err))
        }, 1500)
    }

    async function handleSearch(e: ChangeEvent) {
        const input = e.target as HTMLInputElement
        const query = input.value
        if (!query) return setSearchResults(undefined)

        // If user is still typing, stop the fetch request
        const timerId = timerRef.current
        if (timerId) clearTimeout(timerId)
        getResults(query)
    }

    return (
        <>
            <div className={styles['btn']} onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                <div className={styles['circle']}></div>
                <div className={styles['circle']}></div>
                <div className={styles['circle']}></div>
            </div>
            <dialog ref={dialogRef} className={styles['container']}>
                <input
                    name='searchBar'
                    className={styles['searchBar']}
                    placeholder='Attack on Titans...'
                    onChange={handleSearch}
                />
                <div className={styles['searchResults']}>
                    {animes.length > 0 && animes.map(anime => (
                        <AnimeInfo key={anime.id} anime={anime} dialogRef={dialogRef} />
                    ))}
                </div>
                <div>
                    <button onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                        Close
                    </button>
                </div>
            </dialog>
        </>
    )
}