import { CSSProperties } from 'react'
import styles from './loader.module.css'

export default function Loader() {
    const chats = [
        ``,
        `So..`,
        `This is taking awhile...`,
        ``,
        `Wanna chat?`,
        `Kinda lonely here y'know?`,
        ``,
        `...`,
        ``,
        `Oh really? That's a cool story, man!`,
        `JK I have no idea what you're saying lol.`,
        ``,
        ``,
        `Damn...`,
        ``,
        ``,
        `DAMN.`,
        `You sure you're connected?`,
        ``,
        `I'm just gonna...`,
        `* Heads out *`
    ]
    return (
        <section className={styles['container']}>
            {chats.map((chat, idx) => (
                <h1 key={idx} style={{ '--delay': idx } as CSSProperties}>
                    {chat}
                </h1>
            ))}
            <span className={styles['loader']}></span>
        </section>
    )
}