'use client'

import isBot from "@/lib/fingerprintjs/isBot"
import { useEffect, useState } from "react"

/**
 * Created to make sure window exists
 * @returns 
 */
export default function BotDetection() {
    const [yesBot, setIsBot] = useState(false)
    useEffect(() => {
        
        if (typeof window === 'undefined') return

        isBot()
            .then(result => {
                setIsBot(result)
                console.log(`IS A BOT? ${result}`.toUpperCase())
            })

        if (yesBot) throw new Error('BOT DETECTED')

    }, [yesBot])

    return <></>
}