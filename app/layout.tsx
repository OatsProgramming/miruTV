import { getServerSession } from 'next-auth'
import { SignIn, SignOut } from './components/AuthBtns/AuthBtns'
import './globals.css'
import { authOptions } from './api/auth/[...nextauth]/route'
import Link from 'next/link'

export const metadata = {
  title: 'Miru TV',
  description: 'Just Anime. No pop ups. No VPN required.',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body>
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <SignIn />
          <SignOut />
          <div>{JSON.stringify(session)}</div>
          <Link href='/'>HOME</Link>
          <Link href='/one'>ONE</Link>
          <Link href='/two'>TWO</Link>
        </div>
        {children}
      </body>
    </html>
  )
}
