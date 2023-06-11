'use client'

import CommentsSkeleton from "../CommentsSkeleton/CommentsSkeleton"
import useComments from "../hooks/useComments"
import styles from './commentsComp.module.css'
import CommentComp from "../CommentComp/CommentComp"
import CommentProvider from "../CommentProvider/CommentProvider"
import useReplies from "../hooks/useReplies"
import useCurrentComment from "../hooks/useCurrentComment"
import CommentContent from "../CommentContent/CommentContent"

export default function CommentsComp({ epId }: {
    epId: string
}) {
    // If in replies
    const { currentComment, setCurrentComment, goBackOne, prevComments, goBackMain } = useCurrentComment()
    // Note to self: dont pass isLoading as params (will load infinitely)
    const { comments, isLoading, error, refresh } = currentComment
        ? useReplies(currentComment.id)
        : useComments(epId)

    if (isLoading) return <CommentsSkeleton />
    else if (error) throw new Error(error)

    return (
        <div className={styles['comments']}>
            {currentComment && (
                <>
                    <div className='comment'>
                        <CommentContent asOP={currentComment} />
                    </div>
                    <button onPointerDown={() => goBackMain()}>
                        Go Back
                    </button>
                    <button onPointerDown={() => goBackOne()}>
                        Go Back One
                    </button>
                </>
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