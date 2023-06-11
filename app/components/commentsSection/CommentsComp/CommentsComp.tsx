import CommentsSkeleton from "../CommentsSkeleton/CommentsSkeleton"
import useComments from "../hooks/useComments"
import styles from './commentsComp.module.css'
import CommentComp from "../CommentComp/CommentComp"
import CommentProvider from "../CommentProvider/CommentProvider"
import useReplies from "../hooks/useReplies"

export default function CommentsComp({ param }: CommentsSectionParam) {
    // Note to self: dont pass isLoading as params (will load infinitely)
    const { comments, isLoading, error, refresh } = 'commentId' in param 
        ? useReplies(param.commentId)
        : useComments(param.epId)

    if (isLoading) return <CommentsSkeleton />
    else if (error) throw new Error(error)

    return (
        <div className={styles['comments']}>
            {'commentId' in param && (
                <CommentComp refresh={refresh} />
            )}
            {(comments && comments.length > 0) 
                ?   comments.map(comment => (
                        <CommentProvider comment={comment}>
                            <CommentComp refresh={refresh} />
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