import styles from './page.module.css'
import Card from './components/Card/Card'
import enimeFetcher from '@/lib/fetchers/enimeFetcher'
import enimeFetcherToy from '@/lib/toyData/enimeFetcherToy'

export default async function Home() {
  const recentRes = enimeFetcherToy({ route: 'recent'}) 
  const popularRes = enimeFetcherToy({ route: 'popular'})

  const [recents, popular] = 
    await Promise.all([recentRes, popularRes])

  const recentList = recents ? recents.data : []
  const popularList = popular ? popular.data : []

  return (
    <main>
      <div className={styles['animeList']}>
        {recentList.map(item => (
          item.anime.title.english !== null && (
            <Card
              key={item.id}
              info={{
                animeId: item.anime.id,
                animeTitle: item.anime.title.english,
                coverImg: item.anime.coverImage,
              }}
              epInfo={{
                title: item.title,
                number: item.number,
                sources: item.sources
              }}
            />
          )
        ))}
      </div>
      <div className={styles['animeList']}>
        {popularList.map(item => (
          item.title.english !== null && (
            <Card
              key={item.id}
              info={{
                animeId: item.id,
                animeTitle: item.title.english,
                coverImg: item.coverImage,
              }}
            />
          )
        ))}
      </div>
    </main>
  )
}
