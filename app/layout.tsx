import { getServerSession } from 'next-auth'
import { SignIn, SignOut } from './components/AuthBtns/AuthBtns'
import './globals.css'
import { authOptions } from './api/auth/[...nextauth]/route'
import Link from 'next/link'
import { Nunito } from 'next/font/google'
import SignUp from './components/SignUp/SignUp'
import FavId from './components/FavId/FavId'


export const metadata = {
  title: 'Miru TV',
  description: 'Just Anime. No pop ups. No VPN required.',
}

const nunito = Nunito({
  subsets: ['latin'],
  weight: '700'
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={nunito.className}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          {session ? (
            <>
              <SignOut />
              <div>{JSON.stringify(session.user)}</div>
            </>
          ) : (
            <>
              <SignIn />
              <SignUp />
            </>
          )}
          <Link href='/'>HOME</Link>
          <FavId />
        </div>
        {children}
      </body>
    </html>
  )
}
