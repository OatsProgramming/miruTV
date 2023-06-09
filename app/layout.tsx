import './globals.css'
import { Nunito } from 'next/font/google'
import NavBar from './components/NavBar/NavBar'
import 'react-toastify/dist/ReactToastify.css'
import SessionProviderComp from './SessionProvider'
import Footer from './components/Footer/Footer'
import '@splidejs/react-splide/css';
import Hero from './components/Hero/Hero'

export const metadata = {
  title: 'Miru TV',
  description: 'Just Anime. No pop ups. No VPN required.',
}

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['700', '500', '300', '200']
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        {/* @ts-expect-error */}
        <NavBar />
        <SessionProviderComp>
          {children}
        </SessionProviderComp>
        <Footer />
        {/* Toast doesnt show unless set at the designated areas... */}
        {/* Even tho it was recommended to set it at the highest */}
        {/* <ToastContainer {...toastOptions} /> */}
      </body>
    </html>
  )
}
