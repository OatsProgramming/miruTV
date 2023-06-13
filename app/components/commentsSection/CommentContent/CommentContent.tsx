import { RefObject, useEffect, useRef } from 'react'
import { getCommentContext } from '../CommentProvider/CommentProvider'
import styles from './commentContent.module.css'
import formatDistance from 'date-fns/formatDistance'
import notify from '@/lib/toast/toast'
import { useSession } from 'next-auth/react'
import type { Comment } from '@prisma/client'
import useCurrentComment from '../hooks/useCurrentComment'

type CommentContentParam = {
    inComments: {
        comment: Comment,
        dialogRef: RefObject<HTMLDialogElement>,
        setIsEditing: (arg: boolean) => void,
        mutateComment: (newBody?: string) => void,
    }
} | {
    /**
     * as Original Poster
     */
    asOP: Comment
}

export default function CommentContent(param: CommentContentParam) {
    const { data } = useSession()
    const { setCurrentComment } = useCurrentComment()
    const menuBtnRef = useRef<HTMLDivElement>(null)

    const comment = 'asOP' in param 
        ? param.asOP
        : getCommentContext()
    
    if (!comment) throw new Error("Comment is null (Comment content)")

    const createdAt = new Date(comment.createdAt)
    const updatedAt = new Date(comment.updatedAt)
    const today = Date.now()
    const isUpdated = +createdAt === +updatedAt
    const timeDiff = formatDistance(updatedAt, today, { addSuffix: true })

    if (!('inComments' in param)) return (
        <div className={styles['text']}>
            <div>
                <span>{comment.createdBy}</span>
                <span>::</span>
                <span>{isUpdated && 'updated '}{timeDiff}</span>
            </div>
            <p>{comment.body}</p>
        </div>
    )

    const { dialogRef, setIsEditing, mutateComment } = param.inComments

    const handleEdit = () => {
        setIsEditing(true)
        dialogRef.current?.close()
    }

    const handleReport = () => {
        notify({ type: 'warning', message: 'This feature is yet to be added.' })
        dialogRef.current?.close()
    }

    // For comment menu
    useEffect(() => {
        function handleClose(e: Event) {
            const dialog = dialogRef.current
            const menuBtn = menuBtnRef.current
            if (!dialog || !menuBtn) return
            // Only care abt the dialog being open
            else if (!dialog.open) return
            const el = e.target as HTMLElement

            const dontToggle = el.dataset.dontToggle
            if (dontToggle) return

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
            <button onPointerDown={handleReport}>
                Report
            </button>
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
                    <button onPointerDown={() => mutateComment()}>
                        Delete
                    </button>
                </>
            )
        }
    }

    return (
        <>
            <div className={styles['text']}>
                <div>
                    <span>{comment.createdBy}</span>
                    <span>::</span>
                    <span>{isUpdated && 'updated '}{timeDiff}</span>
                </div>
                <p>{comment.body}</p>
            </div>
            <div ref={menuBtnRef} className={styles['icon']} onPointerDown={() => dialogRef.current?.show()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"
                    onClick={() => setCurrentComment(comment)}
                    data-dont-toggle={true}
                >
                    <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353V2zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                </svg>
                <dialog ref={dialogRef} className={styles['menu']}>
                    {optionBtns}
                </dialog>
            </div>
        </>
    )
}