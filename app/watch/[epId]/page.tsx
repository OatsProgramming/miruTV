import OPlayer from "@/app/watch/components/OPlayer/OPlayer";
import styles from './page.module.css'
import CommentsSection from "@/app/components/CommentsSection/CommentsSection";
import animeFetcher from "@/app/util/animeFetcher/animeFetcher";
import { Metadata } from "next";
import getTitleXEpNumber from "@/app/util/getTitleXEpNumber";
import Link from "next/link";
import getAnimeInfo from "@/app/util/fetchers/getAnimeInfo";
import Countdown from "@/app/components/Countdown/Countdown";
import getAnimeTitle from "@/app/util/getAnimeTitle";
import Episodes from "@/app/components/Episodes/Episodes";
import EpisodesBackup from "@/app/components/EpisodesBackup/EpisodesBackup";
import Recommendations from "../components/Recommendations/Recommendations";

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
    const animeInfo = await getAnimeInfo(title)

    return (
        <div className={styles['container']}>
            <div className={styles['grid']}>
                <div className={styles['content']}>
                    <div>
                        <Link href={`/info/${animeInfo?.id}`}>
                            <h1>{getAnimeTitle(animeInfo?.title)}</h1>
                        </Link>
                        <h3>EP: {episode}</h3>
                    </div>
                    <OPlayer sourcesPromise={sourcesPromise} />
                </div>
                {/* TODO: Change this to mainly episode numbers */}
                <section className={styles['episodes']}>
                    {animeInfo?.episodes.length !== 0
                        ? <Episodes epId={epId} animeInfo={animeInfo!} />
                        : <EpisodesBackup epId={epId} animeInfo={animeInfo!} />
                    }
                </section>
                <CommentsSection epId={epId} />
            </div>
            <section className={styles['countdown']}>
                <Countdown
                    animeStatus={animeInfo?.status}
                    nextAiringEpisode={animeInfo?.nextAiringEpisode!}
                />
            </section>
            <section className={styles['recommendations']}>
                <Recommendations recommendations={animeInfo?.recommendations} />
            </section>
        </div>
    )
}

function Box1({ animeInfo, episode }: {
    animeInfo: IAnimeInfoFiltered,
    episode: string
}) {
    return (
        <div>
            <Link href={`/info/${animeInfo?.id}`}>
                <h1>{getAnimeTitle(animeInfo?.title)}</h1>
            </Link>
            <h3>EP: {episode}</h3>
        </div>
    )
}

function Box2({ animeInfo, epId }: {
    animeInfo: IAnimeInfoFiltered,
    epId: string
}) {
    return (
        <section className={styles['episodes']}>
            {animeInfo?.episodes.length !== 0
                ? <Episodes epId={epId} animeInfo={animeInfo!} />
                : <EpisodesBackup epId={epId} animeInfo={animeInfo!} />
            }
        </section>
    )
}

function Box3({ animeInfo }: {
    animeInfo: IAnimeInfoFiltered
}) {
    return (
        <>
            <section className={styles['countdown']}>
                <Countdown
                    animeStatus={animeInfo?.status}
                    nextAiringEpisode={animeInfo?.nextAiringEpisode!}
                />
            </section>
            <section className={styles['recommendations']}>
                <Recommendations recommendations={animeInfo?.recommendations} />
            </section>
        </>
    )
}

