import type { Session } from 'next-auth'
import Card from '../Card/Card'
import fetchFavs from '@/lib/fetchers/fetchFavs'
import type { CSSProperties } from 'react'
import { Suspense } from 'react'
import Loader from '../Loader/Loader'

/**
 * As of rn, this is for the home pg when user is signed in.
 * Can't make this work with anything else but an EnimeAnime type. (Maybe figure out later)
 */
export default async function FavSect({ session, style }: {
    session: Session,
    style?: CSSProperties,
}) {
    const fallback = 
        <Loader
            isntChatty
            style={{
                width: '100vw',
                height: '25vh',
                display: 'grid',
                placeItems: 'center'
            }}
        />
    
    const favIds = await fetchFavs(session.user.favIds) ?? []
    return (
        <Suspense fallback={fallback}>
            {favIds.length > 0 ? favIds.map((fav, idx) => (
                fav.title.english !== null && (
                    // Change this once dealing with real data
                    <Card
                        key={idx}
                        info={{
                            animeId: fav.id,
                            animeTitle: fav.title.english ?? 'N/A',
                            coverImg: fav.coverImage,
                        }}
                        style={style}
                    />
                )
            )) : (
                <Card
                    info={{
                        animeId: 777,
                        animeTitle: "",
                        coverImg: ""
                    }}
                    style={style}
                />
            )}
        </Suspense>
    )
}