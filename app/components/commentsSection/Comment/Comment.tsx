'use client'

import { useSession } from "next-auth/react"
import styles from './comment.module.css'
import { memo, useCallback, useEffect, useRef, useState } from "react"
import mutatingFetcher from "@/lib/fetchers/mutatingFetcher"
import type { Comment } from '@prisma/client'
import type { PointerEvent } from "react"
import { commentMaxChar } from "../addComment/AddComment"
import notify from "@/lib/toast/toast"
import useComments from "../hooks/useComments"
import isEqual from "lodash/isEqual"

function commentComp({ comment }: {
    comment: Comment
}) {
    const { data } = useSession()
    const [commentBody, setCommentBody] = useState(comment.body)
    const [isEditing, setIsEditing] = useState(false)
    const menuBtnRef = useRef<HTMLDivElement>(null)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { refreshComments } = useComments(comment.epId)

    const mutateComment = useCallback((e: PointerEvent) => {
        const el = e.target as HTMLButtonElement
        const action = el.dataset.httpMethod as Exclude<Method, 'GET' | 'POST'>
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
    }, [dialogRef.current, isEditing])

    const handleCancel = useCallback(() => {
        if (comment.body !== commentBody) setCommentBody(comment.body)
        setIsEditing(false)
    }, [])

    // useCallback no bueno here
    const handleMutate = (e: PointerEvent) => {
        dialogRef.current?.close()
        mutateComment(e)
    }

    const handleEdit = useCallback(() => {
        setIsEditing(true)
        dialogRef.current?.close()
    }, [dialogRef.current])

    // For comment menu
    useEffect(() => {
        function handleClose(e: Event) {
            const dialog = dialogRef.current
            const menuBtn = menuBtnRef.current
            if (!dialog || !menuBtn) return
            // Only care abt the dialog being open
            else if (!dialog.open) return
            const el = e.target as HTMLElement

            // True if user clicks outside of current dialog && current dialog is open
            const scenarioOne = (el === dialog)

            // True if user clicks dialogChild
            const dialogWeakSet = new WeakSet(dialog.children)
            const scenarioTwo = dialogWeakSet.has(el)

            // True if user clicks menuBtn (for initial)
            const scenarioThree = (el === menuBtn)

            // True if user clicks MenuBtnChild
            const menuWeakSet = new WeakSet(menuBtn.children)
            const scenarioFour = menuWeakSet.has(el)

            // User clicks non dialog related nodes while current dialog is open
            if (!scenarioOne && !scenarioTwo) {
                // User clicks non menu related nodes
                if (!scenarioThree && !scenarioFour) {
                    dialog.close()
                }
            }
        }

        window.addEventListener('pointerdown', handleClose)
        return () => {
            window.removeEventListener('pointerdown', handleClose)
        }
    }, [])

    // Note to self: Do this at the end
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
                    <button onPointerDown={handleEdit}>
                        Edit
                    </button>
                    <button data-http-method='DELETE' onPointerDown={handleMutate}>
                        Delete
                    </button>
                </>
            )
        }
    }

    return (
        <div className={styles['container']}>
            <div className={styles['comment']}>
                {isEditing ? (
                    <>
                        <textarea
                            ref={textareaRef}
                            value={commentBody}
                            onChange={(e) => setCommentBody(e.target.value)}
                            className={styles['editComment']}
                            placeholder={comment.body}
                            maxLength={commentMaxChar}
                            spellCheck
                            onLoad={() => console.log('asd')}
                        />
                        <button data-http-method="PATCH" onPointerDown={handleMutate}>
                            Save
                        </button>
                        <button onPointerDown={handleCancel}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <div className={styles['text']}>
                            <div>{comment.createdBy}</div>
                            <p>{comment.body}</p>
                        </div>
                        <div ref={menuBtnRef} className={styles['btn']} onPointerDown={() => dialogRef.current?.show()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
                        </div>
                    </>
                )}
            </div>
            <dialog ref={dialogRef} className={styles['menu']}>
                {optionBtns}
            </dialog>
        </div >
    )
}

const CommentComp = memo(commentComp, (prev, next) => {
    return isEqual(prev.comment, next.comment)
})

export default CommentComp

