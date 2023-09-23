import OPlayer from "@/app/watch/components/OPlayer/OPlayer";
import styles from './page.module.css'
import CommentsSection from "@/app/components/CommentsSection/CommentsSection";
import { notFound } from "next/navigation";
import animeFetcher from "@/app/util/animeFetcher/animeFetcher";
import { Metadata } from "next";
import Episodes from "../components/Episodes/Episodes";
import getTitleXEpNumber from "@/app/util/getTitleXEpNumber";
import Info from "../components/Info/Info";

export async function generateMetadata({ params: { epId } }: {
    params: {
        epId: string
    }
}): Promise<Metadata> {
    const { title, episode } = getTitleXEpNumber(epId)
    const animeInfo = await animeFetcher({ route: 'episodes', arg: title })
    if (!animeInfo) notFound()

    return {
        title: `Watch now: ${title} EP: ${episode}`,
        description: animeInfo.description
    }
}

export default async function Page({ params: { epId } }: {
    params: {
        epId: string
    }
}) {
    const { title } = getTitleXEpNumber(epId)

    // Doing it like this so that it can load in parallel instead concurrently
    const sourcesPromise = animeFetcher({ route: 'source', arg: epId })
    const animeInfoPromise = animeFetcher({ route: 'episodes', arg: title })

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                {/* @ts-expect-error */}
                <Info epId={epId} animeInfoPromise={animeInfoPromise} />
                <OPlayer sourcesPromise={sourcesPromise} />
            </div>
            {/* @ts-expect-error */}
            <Episodes epId={epId} animeInfoPromise={animeInfoPromise} />
            <CommentsSection epId={epId} />
        </div>
    )
}