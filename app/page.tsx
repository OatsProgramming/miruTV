import styles from './page.module.css'
import SignUp from './components/SignUp/SignUp'
import FavId from './components/FavId/FavId'
import HLSPlayer from './components/HLSPlayer/HLSPlayer'

export default function Home() {
  return (
    <main>
      <SignUp />
      <FavId />
      <HLSPlayer 
        src='https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
        poster='https://oplayer.vercel.app/poster.png'
      />
      <div>asd</div>
    </main>
  )
}
