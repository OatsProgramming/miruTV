import type { Session } from 'next-auth'
import Card from '../Card/Card'
import fetchFavs from '@/app/util/fetchers/fetchFavs'
import type { CSSProperties, RefObject } from 'react'
import { Suspense } from 'react'
import Loader from '../Loader/Loader'
import AnimeInfo from '../AnimeInfo/AnimeInfo'
import getAnimeTitle from '@/app/util/getAnimeTitle'

export default async function FavSect({ session, style, dialogRef }: {
    session: Session,
    style?: CSSProperties,
    dialogRef?: RefObject<HTMLDialogElement>
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
    const noSaves: Partial<AnimeInfoResult> = {
        // @ts-expect-error
        id: 777,
        title: "No Saves...?",
        description: "There's nothing saved here... Kinda' beats the purpose of having an account, huh?",
        coverImage: ""
    }

    return (
        // This is ugly code...
        <Suspense fallback={fallback}>
            {favIds.length > 0 ? favIds.map((fav, idx) => (
                <>
                    {dialogRef ? (
                        <AnimeInfo anime={fav} dialogRef={dialogRef} />
                    ) : (
                        <Card
                            key={idx}
                            info={{
                                animeId: fav.id,
                                animeTitle: getAnimeTitle(fav.title)!,
                                coverImg: fav.cover,
                            }}
                            style={style}
                        />
                    )}
                </>
            )) : (
                <>
                    {dialogRef ? (
                        <AnimeInfo anime={noSaves as AnimeInfoResult} dialogRef={dialogRef} />
                    ) : (
                        <Card
                            info={{
                                animeId: 777,
                                animeTitle: "",
                                coverImg: ""
                            }}
                            style={style}
                        />
                    )}
                </>
            )}
        </Suspense>
    )
}