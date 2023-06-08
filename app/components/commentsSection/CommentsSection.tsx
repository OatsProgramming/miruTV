'use client'

import styles from './commentsSection.module.css'
import AddComment from './addComment/AddComment'
import useComments from './hooks/useComments'
import CommentsSkeleton from './CommentsSkeleton/CommentsSkeleton'

export default function CommmentsSection({ epId }: {
    epId: string
}) {

    const { comments, isLoading, error } = useComments(epId)

    if (isLoading) return <CommentsSkeleton />
    else if (error) throw new Error(error)

    return (
        <section id='commentsSection' className={styles['commentsSection']}>
            <AddComment epId={epId} />
            <div className={styles['comments']}>
                {(comments && comments.length > 0) ? (
                    comments.map(comment =>
                        <div
                            key={comment.id}
                            className={styles['comment']}
                        >
                            {comment.body}
                        </div>
                    )
                ) : (
                    <div className={styles['comment']}>
                        Be the first to comment!
                    </div>
                )}
            </div>
        </section>
    )
}