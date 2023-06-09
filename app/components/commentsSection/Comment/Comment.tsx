'use client'

import { useSession } from "next-auth/react"
import styles from './comment.module.css'
import { useRef, useState } from "react"
import mutatingFetcher from "@/lib/fetchers/mutatingFetcher"
import type { Comment } from '@prisma/client'
import type { PointerEvent } from "react"
import { commentMaxChar } from "../addComment/AddComment"
import notify from "@/lib/toast/toast"
import { useSWRConfig } from "swr"
import useComments from "../hooks/useComments"
import toggleDialog from "@/lib/toggleDialog"

export default function Comment({ comment }: {
    comment: Comment
}) {
    const { data, status } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { refreshComments } = useComments(comment.epId)

    function editComment(e: PointerEvent) {
        const el = e.target as HTMLButtonElement
        const action = el.id as Exclude<Method, 'GET' | 'POST'>
        let req: CommentRequest = {
            commentId: comment.id
        }

        if (action === 'PATCH') {
            const textarea = textareaRef.current
            if (!textarea) return
            const text = textarea.value.trim()
            // Dont send the request if text is empty
            if (!text) return
            req.body = text
        }

        mutatingFetcher('/api/comments', action, req)
            // If anything goes wrong (thats not dev related) let user know
            // Dont forget to revalidate the data
            .then(res => 'message' in res
                ? notify({ type: 'error', message: res.message })
                : refreshComments() 
            )
            .catch(err => console.error(err))
        
        // Clean up
        dialogRef.current?.close()
        isEditing && setIsEditing(false)
    }

    let optionBtns = (
        <>
            <button>Report</button>
        </>
    )

    if (data) {
        const { id: userId } = data.user
        if (userId === comment.userId) {
            optionBtns = (
                <>
                    <button onPointerDown={() => setIsEditing(true)}>
                        Edit
                    </button>
                    <button id='DELETE' onPointerDown={(e) => editComment(e)}>
                        Delete
                    </button>
                </>
            )
        }
    }

    function handleCancel() {
        const textarea = textareaRef.current
        if (!textarea) return
        textarea.value = ''
        setIsEditing(false)
    }

    return (
        <div className={styles['container']}>
            {isEditing ? (
                <>
                    <textarea
                        ref={textareaRef}
                        className={styles['editComment']}
                        placeholder={comment.body}
                        maxLength={commentMaxChar}
                        spellCheck
                    />
                    <button id="PATCH" onPointerDown={(e) => editComment(e)}>
                        Save
                    </button>
                    <button onPointerDown={handleCancel}>
                        Cancel
                    </button>
                </>
            ) : (
                <div className={styles['text']}>
                    <div>{comment.userId}</div>
                    <div>{comment.createdBy}</div>
                    <div>{comment.body}</div>
                </div>
            )}
            <div className={styles['icon']} onPointerDown={() => dialogRef.current?.show()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
            </div>
            <dialog ref={dialogRef}>
                {optionBtns}
                <button onPointerDown={() => dialogRef.current?.close()}>
                    Close
                </button>
            </dialog>
        </div>
    )
}