import styles from './page.module.css'
import FavId from './components/FavId/FavId'
import HLSPlayer from './components/HLSPlayer/HLSPlayer'
import Card from './components/Card/Card'
import recentsToy from '@/lib/toyData/recentsToy'
import getPopular from '@/lib/fetchers/getPopular'
import getRecents from '@/lib/fetchers/getRecents'

export default async function Home() {
  // const recents = await getRecents()
  const recentRes = getRecents()
  const popularRes = getPopular()

  const [recents, popular] = await Promise.all([recentRes, popularRes])

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
