import { Inter } from 'next/font/google'
import styles from './page.module.css'
import SignUp from './components/SignUp/SignUp'
import FavId from './components/FavId/FavId'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <SignUp />
      <FavId />
    </main>
  )
}
