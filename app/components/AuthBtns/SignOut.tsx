'use client'

import useUrl from "@/lib/zustand/useUrl"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignOut() {
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