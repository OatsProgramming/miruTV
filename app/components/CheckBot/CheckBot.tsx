'use client'

import useTurnstileStore from "./hooks/useTurnstileStore"
import { useEffect, useRef } from "react"
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import styles from './checkBot.module.css'

export default function CheckBot({ children }: {
    children: React.ReactNode
}) {

    const { isSuccess, TSResponse, isValidToken, setIsSuccess, setTSResponse, setIsValidToken } = useTurnstileStore()
    const turnstileRef = useRef<TurnstileInstance>(null)

    useEffect(() => {
        if (!isSuccess) return
        (async () => {
            const turnstile = turnstileRef.current
            if (!turnstile) return

            const body = JSON.stringify({ turnstileResponse: turnstile.getResponse() })

            try {
                const res = await fetch("/api/turnstile", {
                    method: "POST",
                    body
                })
                if (!res.ok) {
                    const result = await res.text()
                    console.log(result)
                    throw new Error(result)
                }
                const result = await res.json() as TurnstileResponse
                setTSResponse(result)
                setIsValidToken(result.success)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [isSuccess])

    return (
        <>
            {isSuccess && isValidToken
                ? children
                : <div className={styles['container']}>
                    <div className={styles['text']}>
                        Let's make sure you're human...
                    </div>
                    <div className={styles['text']}>
                        ...and not an a**hole that's crashing my site with bots.
                    </div>
                    <Turnstile
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                        onError={() => setIsSuccess(false)}
                        onSuccess={() => setIsSuccess(true)}
                    />
                </div>
            }
        </>
    )
}

