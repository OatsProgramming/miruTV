'use client'
import { PointerEvent, useRef } from 'react'
import styles from './addComment.module.css'
import useComments from '../useComments'
import type { Comment } from '@prisma/client'


export default function AddComment({ epId, comments }: {
    epId: string,
    comments: Comment[]
}) {
    const maxChar = 1000
    const { mutate } = useComments(epId)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    async function handleComment(e: PointerEvent) {
        const textarea = textareaRef.current
        if (!textarea) return
        else if (!textarea.value) return

        // Theres an svg in the way; use currentTarget
        const btn = e.currentTarget as HTMLButtonElement
        // Determine action type
        const action = btn.id
        if (action === 'send') {
            try {
                const res = await fetch('/api/comments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'applications/json'
                    },
                    body: JSON.stringify({
                        epId,
                        body: textarea.value
                    })
                })
                //  On error
                if (!res.ok) {
                    const result = await res.text()
                    console.log(result)
                    return
                }
                const result = await res.json()

                // "Revalidate" data on client side
                mutate([...comments, result])
            } catch (err) {
                console.error(err)
            }
        }
        textarea.value = ''
    }

    return (
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
    )
}