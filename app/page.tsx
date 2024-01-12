import styles from './page.module.css'
import Card from './components/Card/Card'
import { getServerSession } from 'next-auth/next'
import authOptions from './api/auth/[...nextauth]/options'
import FavSect from './components/FavSect/FavSect'
import Hero from './components/Hero/Hero'
import animeFetcher from './util/animeFetcher/animeFetcher'
import getAnimeTitle from './util/getAnimeTitle'

export const revalidate = 3600

// TODO: consider loading the sections in parallel 
// TODO: have a loader skeleton 
export default async function Home() {
  const sessionRes = getServerSession(authOptions)
  const recentRes = animeFetcher({ route: 'recents' })
  const trendingRes = animeFetcher({ route: 'trending' })
  const popularRes = animeFetcher({ route: 'popular' })

  const [recents, trending, popular, session] =
    await Promise.all([recentRes, trendingRes, popularRes, sessionRes])

  const recentList = recents ? recents.results : []
  const trendingList = trending ? trending.results : []
  const popularList = popular ? popular.results : []

  return (
    <>
      <Hero animes={trendingList} />
      <main className={styles['container']}>
        <section>
          <h1>Latest Releases:</h1>
          <div className={styles['animeList']}>
            {recentList.map(item =>
              <Card
                key={item.id}
                info={{
                  animeId: item.id,
                  animeTitle: item.title ?? 'N/A',
                  coverImg: item.image,
                }}
                epInfo={{
                  title: item.title,
                  number: item.episodeNumber,
                  epId: item.episodeId
                }}
              />
            )}
          </div>
        </section>
        <section>
          <h1>What We're Watching Right Now:</h1>
          <div className={styles['animeList']}>
            {trendingList.map(item => (
              item !== null && (
                <Card
                  key={item.id}
                  info={{
                    animeId: item.id,
                    animeTitle: getAnimeTitle(item.title),
                    coverImg: item.image,
                  }}
                />
              )
            ))}
          </div>
        </section>
        <section>
          <h1>Top Animes to Add to Your Watchlist:</h1>
          <div className={styles['animeList']}>
            {popularList.map(item => (
              item !== null && (
                <Card
                  key={item.id}
                  info={{
                    animeId: item.id,
                    animeTitle: getAnimeTitle(item.title),
                    coverImg: item.image,
                  }}
                />
              )
            ))}
          </div>
        </section>
        {session && (
          <section>
            <h1>We Got Your Saves:</h1>
            <div className={styles['animeList']}>
              {/* @ts-expect-error */}
              <FavSect session={session} />
            </div>
          </section>
        )}
      </main>
    </>
  )
}
