'use client'

import CommentsSkeleton from "../CommentsSkeleton/CommentsSkeleton"
import useComments from "../hooks/useComments"
import styles from './commentsComp.module.css'
import CommentComp from "../CommentComp/CommentComp"
import CommentProvider from "../CommentProvider/CommentProvider"

export default function CommentsComp({ epId }: {
    epId: string,
}) {
    const { comments, isLoading, error } = useComments(epId)

    if (isLoading) return <CommentsSkeleton />
    else if (error) throw new Error(error)

    return (
        <div className={styles['comments']}>
            {(comments && comments.length > 0) 
                ?   comments.map(comment => (
                        <CommentProvider comment={comment}>
                            <CommentComp epId={epId} />
                        </CommentProvider>
                    ))
                : (
                    <div className={styles['comment']}>
                        Be the first to comment!
                    </div>
                )}
        </div>
    )
}