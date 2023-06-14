import styles from './page.module.css'
import Card from './components/Card/Card'
import enimeFetcher from '@/lib/fetchers/enimeFetcher'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import FavSect from './components/FavSect/FavSect'
import Hero from './components/Hero/Hero'
import EmailContact from './components/EmailDialog/EmailContact'

export const revalidate = 3600

export default async function Home() {
  // return <EmailContact />
  const sessionRes = getServerSession(authOptions)
  const recentRes = enimeFetcher({ route: 'recent' })
  const popularRes = enimeFetcher({ route: 'popular' })

  const [recents, popular, session] =
    await Promise.all([recentRes, popularRes, sessionRes])

  const recentList = recents ? recents.data : []
  const popularList = popular ? popular.data : []

  return (
    <>
      <Hero animes={popularList}/>
      <main className={styles['container']}>
        <section>
          <h1>Latest Releases:</h1>
          <div className={styles['animeList']}>
            {recentList.map(item => (
              item.anime.title.english !== null && (
                <Card
                  key={item.id}
                  info={{
                    animeId: item.anime.id,
                    animeTitle: item.anime.title.english ?? 'N/A',
                    coverImg: item.anime.coverImage,
                  }}
                  epInfo={{
                    title: item.title,
                    number: item.number,
                  }}
                />
              )
            ))}
          </div>
        </section>
        <section>
          <h1>What We're Watching Right Now:</h1>
          <div className={styles['animeList']}>
            {popularList.map(item => (
              item.title.english !== null && (
                <Card
                  key={item.id}
                  info={{
                    animeId: item.id,
                    animeTitle: item.title.english ?? 'N/A',
                    coverImg: item.coverImage,
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
