'use client' // Error components must be Client Components

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    const router = useRouter()
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <section className='error'>
            <h1>Well... S***.</h1>
            <div className='errorOverlay' />
            <div className='errorText'>
                <h2>You're not supposed to see this.</h2>
                <div className='errorBtns'>
                    <button onClick={() => reset()}>
                        Try again
                    </button>
                    <button onClick={() => router.push('/')}>
                        Go Home
                    </button>
                </div>
            </div>
        </section>
    )
}