'use client'

import { useEffect, useState } from "react"
import styles from './countdown.module.css'
import { formatRFC } from "@/lib/formatRFC"

export default function Countdown({ animeStatus, nextAiringEpisode }: {
    animeStatus?: string,
    nextAiringEpisode: IAnimeInfoFiltered['nextAiringEpisode']
}) {
    const [time, setTime] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    
    const { days, hours, minutes, seconds } = time

    let { airingTime, timeUntilAiring } = nextAiringEpisode

    const airingDate = formatRFC(new Date(airingTime * 1000)) // convert unix timestamp to ms then make it human readable


    useEffect(() => {
        const timerId = setTimeout(function countdown() {
            let days, hours, minutes, seconds;

            timeUntilAiring--

            days = Math.floor(timeUntilAiring / (24 * 60 * 60))
            hours = Math.floor((timeUntilAiring % (24 * 60 * 60)) / 3600)
            minutes = Math.floor((timeUntilAiring % 3600) / 60)
            seconds = Math.floor(timeUntilAiring % 60)

            setTimeout(countdown, 1000)

            setTime({
                days,
                hours,
                minutes,
                seconds
            })

        }, 1000)
        return () => clearTimeout(timerId)
    }, [])

    return (
        <div className={styles['container']}>
                <div>
                    STATUS: <span className={styles['status']}>{animeStatus ?? "UNKNONW"}</span>
                </div>
                <div>
                    TIME TILL NEXT EPISODE:
                </div>
            <div className={styles['countdownContainer']}>
                <Box
                    unit="DAYS"
                    number={days}
                />
                <Box
                    unit="HOURS"
                    number={hours}
                />
                <Box
                    unit="MINUTES"
                    number={minutes}
                />
                <Box
                    unit="SECONDS"
                    number={seconds}
                />
            </div>
            <div className={styles['airingDate']}>
                {airingDate}
            </div>
        </div>
    )
}

function Box({ unit, number }: {
    unit: string,
    number: number
}) {
    return (
        <div className={styles['boxy']}>
            <div>{number}</div>
            <div>{unit}</div>
        </div>
    )
}