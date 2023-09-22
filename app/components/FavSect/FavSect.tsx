import type { Session } from 'next-auth'
import Card from '../Card/Card'
import fetchFavs from '@/app/util/fetchers/fetchFavs'
import type { CSSProperties, RefObject } from 'react'
import { Suspense } from 'react'
import Loader from '../Loader/Loader'
import AnimeInfo from '../AnimeInfo/AnimeInfo'

/**
 * As of rn, this is for the home pg when user is signed in.
 * Can't make this work with anything else but an EnimeAnime type. (Maybe figure out later)
 */
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
    const noSaves: Partial<AnimeInfoBasic> = {
        // @ts-expect-error (making custom anime object)
        id: 777,
        title: "No Saves...?",
        description: "There's nothing saved here... Kinda' beats the purpose of having an account, huh?",
        coverImage: ""
    }
    return (
        // This is ugly code...
        <Suspense fallback={fallback}>
            {favIds.length > 0 ? favIds.map((fav, idx) => (
                fav.title.english !== null && (
                    <>
                        {dialogRef ? (
                            <AnimeInfo anime={fav} dialogRef={dialogRef} />
                        ) : (
                            <Card
                                key={idx}
                                info={{
                                    animeId: fav.id,
                                    animeTitle: fav.title.english ?? 'N/A',
                                    coverImg: fav.coverImage,
                                }}
                                style={style}
                            />
                        )}
                    </>
                )
            )) : (
                <>
                    {dialogRef ? (
                        <AnimeInfo anime={noSaves} dialogRef={dialogRef} />
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