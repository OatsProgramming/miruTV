'use client'

import { PointerEvent, useRef } from 'react'
import styles from './commentsSection.module.css'

export default function CommmentsSection() {
    const maxChar = 1000
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    function handleComment(e: PointerEvent) {
        const textarea = textareaRef.current
        if (!textarea) return

        const div = e.target as HTMLDivElement
        const action = div.id

        if (action === 'send') console.log(textarea.value)
        textarea.value = ''
    }

    const tempComments = [1, 2, 3, 4, 5, 6, , 7, 8, 9, 10]

    return (
        <section id='commentsSection' className={styles['commentsSection']}>
            <div>
                <textarea
                    ref={textareaRef}
                    className={styles['addComment']}
                    placeholder="Join the conversation..."
                    maxLength={maxChar}
                    autoComplete="on"
                    autoCorrect="on"
                />
                <div className={styles['btns']}>
                    <button id='clear' onPointerDown={handleComment}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="50%" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        </svg>
                    </button>
                    <button id='send' onPointerDown={handleComment}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="75%" height="50%" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className={styles['comments']}>
                {tempComments.map(val => (
                    <div
                        className={styles['comment']}
                        key={val}
                    >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur eligendi rerum iusto, perspiciatis repellendus, molestias maxime nesciunt rem sed optio? Officia, saepe.
                    </div>
                ))}
            </div>
        </section>
    )
}