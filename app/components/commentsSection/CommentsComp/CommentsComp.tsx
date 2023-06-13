'use client'

import CommentsSkeleton from "../CommentsSkeleton/CommentsSkeleton"
import useComments from "../hooks/useComments"
import styles from './commentsComp.module.css'
import CommentComp from "../CommentComp/CommentComp"
import CommentProvider from "../CommentProvider/CommentProvider"
import useReplies from "../hooks/useReplies"
import useCurrentComment from "../hooks/useCurrentComment"
import CommentContent from "../CommentContent/CommentContent"
import { useEffect, useRef } from "react"

export default function CommentsComp({ epId }: {
    epId: string
}) {
    const opRef = useRef<HTMLDivElement>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // If in replies
    const { currentComment, goBackOne, goBackMain } = useCurrentComment()
    // Note to self: dont pass isLoading as params (will load infinitely)
    const { comments, isLoading, error, refresh } = currentComment
        ? useReplies(currentComment.id)
        : useComments(epId)

    // To change the color of the opComment (when sticky)
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        function handleScroll(e: Event) {
            const btn = btnRef.current
            const op = opRef.current

            if (!btn) return

            const el = e.target as HTMLElement
            const opThreshold = 50
            const btnThreshold = 150

            // Doing '&&' to prevent it from adding it over and over

            // For button
            if (el.scrollTop > btnThreshold) {
                !btn.classList.contains(styles['goUp']) && btn.classList.add(styles['goUp'])
            } else {
                btn.classList.contains(styles['goUp']) && btn.classList.remove(styles['goUp'])
            }

            // For opComment
            if (!currentComment || !op) return
            else if (el.scrollTop > opThreshold) {
                !op.classList.contains(styles['sticky']) && op.classList.add(styles['sticky'])
            } else {
                op.classList.contains(styles['sticky']) && op.classList.remove(styles['sticky'])
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => {
            container.removeEventListener('scroll', handleScroll)
        }
    }, [containerRef.current, currentComment, opRef.current, btnRef.current])

    function scrollUp() {
        const container = containerRef.current
        if (!container) return
        container.scrollTop = 0
    }

    if (isLoading) return <CommentsSkeleton />
    else if (error) throw new Error(error)

    return (
        <div className={styles['comments']} ref={containerRef}>
            {currentComment && (
                <div className={styles['opComment']} ref={opRef}>
                    <div className='comment'>
                        <CommentContent asOP={currentComment} />
                    </div>
                    <div className={styles['btns']}>
                        <button onPointerDown={() => goBackMain()}>
                            Go Back
                        </button>
                        <button onPointerDown={() => goBackOne()}>
                            Go Back One
                        </button>
                    </div>
                </div>
            )}
            {(comments && comments.length > 0)
                ? comments.map(comment => (
                    <CommentProvider comment={comment}>
                        <CommentComp refresh={refresh} />
                    </CommentProvider>
                ))
                : (
                    <div className='comment'>
                        Be the first to comment!
                    </div>
                )}
            <button className={styles['btn']} ref={btnRef} onPointerDown={scrollUp}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z" />
                </svg>
            </button>
        </div>
    )
}