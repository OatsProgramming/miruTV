'use client'

import useTurnstileStore from "./hooks/useTurnstileStore"
import { useEffect, useRef, useState } from "react"
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'


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
                ?<div>
                    <div>
                        Response: {JSON.stringify(TSResponse)}
                    </div>
                    <div>
                        isValidToken: {JSON.stringify(isValidToken)}
                    </div>
                    <div>
                        SHOW CHILDREN NODES?: {JSON.stringify(isValidToken && isSuccess)}
                    </div>
                    {children}
                </div>
                : <div>
                    <Turnstile
                        ref={turnstileRef}
                        siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY!}
                        onError={() => setIsSuccess(false)}
                        onSuccess={() => setIsSuccess(true)}
                    />
                    <div>
                        Response: {JSON.stringify(TSResponse)}
                    </div>
                    <div>
                        isValidToken: {JSON.stringify(isValidToken)}
                    </div>
                    <div>
                        SHOW CHILDREN NODES?: {JSON.stringify(isValidToken && isSuccess)}
                    </div>
                </div>
            }
        </>
    )
}

