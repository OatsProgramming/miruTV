import OPlayer from "@/app/watch/components/OPlayer/OPlayer";
import styles from './page.module.css'
import CommentsSection from "@/app/components/CommentsSection/CommentsSection";
import animeFetcher from "@/app/util/animeFetcher/animeFetcher";
import { Metadata } from "next";
import Episodes from "../components/Episodes/Episodes";
import getTitleXEpNumber from "@/app/util/getTitleXEpNumber";
import Link from "next/link";
import getAnimeInfo from "@/app/util/fetchers/getAnimeInfo";

export async function generateMetadata({ params: { epId } }: {
    params: {
        epId: string
    }
}): Promise<Metadata> {
    const { title, episode } = getTitleXEpNumber(epId)

    return {
        title: `Watch now: ${title} EP: ${episode}`
    }
}

export default async function Page({ params: { epId } }: {
    params: {
        epId: string
    }
}) {
    const { title, episode } = getTitleXEpNumber(epId)

    // Doing it like this so that it can load in parallel instead concurrently
    const sourcesPromise = animeFetcher({ route: 'source', arg: epId })
    const animeInfoPromise = getAnimeInfo(title)

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <div>
                    {/* FIXME: add the animeId here... */}
                    <Link href={`/info/${''}`}>
                        <h1>{title}</h1>
                    </Link>
                    <h3>EP: {episode}</h3>
                </div>
                <OPlayer sourcesPromise={sourcesPromise} />
            </div>
            {/* TODO: Change this to mainly episode numbers */}
            {/* @ts-expect-error */}
            <Episodes epId={epId} animeInfoPromise={animeInfoPromise} />
            <CommentsSection epId={epId} />
        </div>
    )
}