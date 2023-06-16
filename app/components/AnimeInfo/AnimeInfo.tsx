import Link from "next/link";
import Card from "../Card/Card";
import styles from './animeInfo.module.css'
import type { RefObject } from "react";

export default function AnimeInfo({ anime, dialogRef }: {
    anime: AnimeXL,
    dialogRef: RefObject<HTMLDialogElement>
}) {
    return (
        <div
            // @ts-expect-error
            onClick={(e) => toggleDialog(e, dialogRef)}
            className={styles['resultContainer']}
        >
            <Card
                key={anime.id}
                info={{
                    animeId: anime.id,
                    animeTitle: "",
                    coverImg: anime.coverImage
                }}
                style={{
                    width: 100,
                    fontSize: 'x-small'
                }}
            />
            <div className={styles['animeInfo']}>
                <Link href={`/info/${anime.id}`}>
                    <h2 className={styles['animeTitle']}>
                        {anime.title.english}
                    </h2>
                </Link>
                <p>
                    {anime.description}
                </p>
            </div>
        </div>
    )
}