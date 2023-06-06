import './globals.css'
import { Nunito } from 'next/font/google'
import NavBar from './components/NavBar/NavBar'
import 'react-toastify/dist/ReactToastify.css'

export const metadata = {
  title: 'Miru TV',
  description: 'Just Anime. No pop ups. No VPN required.',
}

const nunito = Nunito({
  subsets: ['latin'],
  weight: '700'
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
        {children}
      </body>
    </html>
  )
}
