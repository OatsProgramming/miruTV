'use client'

import useUrl from '@/lib/zustand/useUrl'
import { signIn } from 'next-auth/react'

export default function SignIn() {
    const { setUrl } = useUrl()
    function handleSignIn() {
        if (typeof window === 'undefined') return
        signIn()
            .then(_ => setUrl(window.location.href))
            .catch(_ => setUrl(''))
    }
    return (
        <button onClick={handleSignIn}>
            Sign in
        </button>
    )
}