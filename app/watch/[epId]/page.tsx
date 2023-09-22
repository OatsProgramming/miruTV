import Card from "@/app/components/Card/Card";
import OPlayer from "@/app/components/OPlayer/OPlayer";
// import enimeFetcher from "@/app/util/fetchers/enimeFetcher";
import styles from './page.module.css'
import CommentsSection from "@/app/components/CommentsSection/CommentsSection";
import { notFound } from "next/navigation";
import Link from "next/link";
import tempImgs from "@/app/util/tempImgs";
import animeFetcher from "@/app/util/animeFetcher/animeFetcher";
import toTitle from "@/app/util/toTitle";

export async function generateMetadata({ params: { epId } }: {
    params: {
        epId: string
    }
}) {
    const title = toTitle(epId)

    return {
        title: `Watch now: ${title}`,
    }
}

export default async function Page({ params: { epId } }: {
    params: {
        epId: string
    }
}) {
    const episode = await animeFetcher({ route: 'source', arg: epId })
    const title = toTitle(epId)

    return (
        <div className={styles['container']}>
            <div className={styles['content']}>
                <h1>{title}</h1>
                {/* <Link href={`/info/${anime.id}`}>
                    <h3>{title}</h3>
                </Link> */}
                {
                    episode?.sources
                        ? <OPlayer sources={episode?.sources} />
                        : <div>Unable to load</div> // TODO: Change this
                }
            </div>
            <div className={styles['episodes']}>
                {/* {episodes.length > 0 && (
                    episodes.map((ep, idx) => (
                        <div
                            key={ep.id}
                            className={`
                                ${styles['card']}
                                ${(idx + 1) === Number(epNumber) && styles['selected']}
                            `}
                        >
                            <Card
                                info={{
                                    animeId: anime.id,
                                    animeTitle: anime.title.english,
                                    coverImg: ep.image
                                }}
                                epInfo={{
                                    title: ep.title,
                                    number: ep.number,
                                }}
                                isLandScape
                            />
                        </div>
                    ))
                )} */}
            </div>
            <CommentsSection epId={epId} />
        </div>
    )
}