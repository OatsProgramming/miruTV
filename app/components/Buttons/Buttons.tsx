'use client'

import useUrl from '@/lib/zustand/useUrl'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function SignIn() {
    const { url, setUrl } = useUrl()
    function handleSignIn() {
        if (typeof window === 'undefined') return
        signIn()
            .then(_ => setUrl(window.location.href))
            .catch(_ => setUrl(''))
    }
    console.log(url)
    return (
        <button onClick={handleSignIn}>
            Sign in
        </button>
    )
}

export function SignOut() {
    const { url, setUrl } = useUrl()
    const router = useRouter()

    async function handleSignOut() {
        // When signing out, prevent user being redirect to the callbackUrl
        await signOut({ callbackUrl: url, redirect: false })
            .then(_ => setUrl(''))
        router.refresh()
    }

    return (
        <button onClick={handleSignOut}>
            Sign out
        </button>
    )
}

export function SignUp() {
    return (
        <Link href='/signUp'>
            Sign Up        
        </Link>
    )
}