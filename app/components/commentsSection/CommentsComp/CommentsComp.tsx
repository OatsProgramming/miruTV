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
        const op = opRef.current
        if (!container || !currentComment || !op) return

        function handleScroll(e: Event) {
            if (!op) return
            const el = e.target as HTMLElement
            const threshold = 50

            // Doing '&&' to prevent it from adding it over and over
            if (el.scrollTop > threshold) {
                !op.classList.contains(styles['sticky']) && op.classList.add(styles['sticky'])
            } else {
                op.classList.contains(styles['sticky']) && op.classList.remove(styles['sticky'])
            }
        }

        container.addEventListener('scroll', handleScroll)
        return () => {
            container.removeEventListener('scroll', handleScroll)
        }
    }, [containerRef, currentComment, opRef])

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
        </div>
    )
}