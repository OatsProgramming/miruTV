'use client'

import CommentsSkeleton from './CommentsSkeleton/CommentsSkeleton'
import AddComment from './addComment/AddComment'
import styles from './commentsSection.module.css'
import useComments from './hooks/useComments'
import CommentComp from './CommentComp/CommentComp'

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
                        <CommentComp comment={comment}/>
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