import './globals.css'
import { Nunito } from 'next/font/google'
import NavBar from './components/NavBar/NavBar'
import 'react-toastify/dist/ReactToastify.css'
import SessionProviderComp from './SessionProvider'
import Footer from './components/Footer/Footer'
import '@splidejs/react-splide/css';
import BotDetection from './components/BotDetection'

export const metadata = {
  title: 'MiruTV',
  description: `Let's watch anime... Just Mi and Ru. MiruTV: an anime streaming site. No VPN or weird H-Anime ads.`,
}

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['700', '500', '300', '200']
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <BotDetection />
        <SessionProviderComp>
          {/* @ts-expect-error */}
          <NavBar />
          {children}
          <Footer />
        </SessionProviderComp>
        {/* Toast doesnt show unless set at the designated areas... */}
        {/* Even tho it was recommended to set it at the highest */}
        {/* <ToastContainer {...toastOptions} /> */}
      </body>
    </html>
  )
}
