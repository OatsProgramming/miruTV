'use client'
import mutatingFetcher from '@/lib/fetchers/mutatingFetcher'
import styles from './favId.module.css'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function FavId({ animeId, favIds }: {
    animeId: string,
    favIds?: FavId[]
}) {
    // Only interested if user is signed in
    if (!favIds) return <></>

    // Does not revalidate page; Dont use swr for this one
    const { update } = useSession()
    const router = useRouter()
    const inFav = favIds.find(fav => fav.animeId === animeId)
    // Only interested if it is in list on INITIAL
    // After, just let it toggle like normal
    const [isFav, setIsFav] = useState(!!inFav)

    function toggleFav() {
        let action: Method;
        let args;
        let newFavIds: FavId[];
        if (isFav) {
            newFavIds = favIds!.filter(fav => fav.animeId !== animeId)
            action = 'DELETE'
            args = { newFavIds }
        } else {
            console.log(favIds)
            const favId = { animeId, lastVisit: new Date().toISOString() }

            newFavIds = [...favIds!, favId]
            action = 'POST'
            args = { favId }
        }
        // Update db
        mutatingFetcher<FavIdsRequest>('/api/favIds', action, args)
            .catch(err => console.log(err))

        // Update session (since it doesnt do that automatically)
        // This way it doesnt have to constantly refetch data from db
        update({ favIds: newFavIds })
            // Seems like gotta call this to refresh the server components
            .then(_ => router.refresh())

        // Toggle manually (since it wont revalidate pg)
        setIsFav(!isFav)
    }
    
    return (
        <div onClick={toggleFav} className={styles['favId']}>
            {isFav ? (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
                    </svg>
                    <div>Remove from Favs</div>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />
                    </svg>
                    <div>Add to Favs</div>
                </>
            )}
        </div>
    )
}