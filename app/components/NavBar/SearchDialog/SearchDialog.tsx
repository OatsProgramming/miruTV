'use client'

import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import styles from './searchDialog.module.css'
import toggleDialog from '@/lib/toggleDialog'
import enimeFetcher from '@/lib/fetchers/enimeFetcher'


export default function SearchDialog() {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const timerRef = useRef<NodeJS.Timeout | undefined>()
    const [searchResults, setSearchResults] = useState<EnimeSearch>()
    const animes = searchResults?.data || []

    function getResults(query: string) {
        // Make sure that it doesnt send too many request accidentally
        // Wait till user is finished typing
        timerRef.current = setTimeout(() => {
            enimeFetcher({ route: 'search', arg: query})
                .then(res => setSearchResults(res))
                .catch(err => console.error(err))
        }, 1500)
    }

    async function handleSearch(e: ChangeEvent) {
        const input = e.target as HTMLInputElement
        const query = input.value
        if (!query) return

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
                <div>
                    {animes.length > 0 ? animes.map(anime => (
                        <div key={anime.id}>
                            <div>
                                {anime.title.english}
                            </div>
                        </div>
                    )) : (
                        <div>
                            Seems empty...
                        </div>
                    )}
                </div>
                <button onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                </button>
            </dialog>
        </>
    )
}