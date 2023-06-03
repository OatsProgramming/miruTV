import styles from './page.module.css'
import Card from './components/Card/Card'
import enimeFetcher from '@/lib/fetchers/enimeFetcher'

export default async function Home() {
  const recentRes = enimeFetcher({ route: 'recent'}) 
  const popularRes = enimeFetcher({ route: 'popular'})

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
              coverImg={item.anime.coverImage}
              animeTitle={item.anime.title.english}
              epTitle={item.title}
              epNumber={item.number}
              sources={item.sources}
            />
          )
        ))}
      </div>
      <div className={styles['animeList']}>
        {popularList.map(item => (
          item.title.english !== null && (
            <Card
              key={item.id}
              coverImg={item.coverImage}
              animeTitle={item.title.english}
            />
          )
        ))}
      </div>
    </main>
  )
}
