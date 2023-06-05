'use client'

import styles from './commentsSection.module.css'
import AddComment from './addComment/AddComment'
import useComments from './useComments'

export default function CommmentsSection({ epId }: {
    epId: string
}) {

    const { comments, isLoading, error } = useComments(epId)
    const tempComments = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    if (isLoading) return <div>Loading...</div>
    else if (error) throw new Error(error)

    return (
        <section id='commentsSection' className={styles['commentsSection']}>
            <AddComment epId={epId} comments={comments}/>
            <div className={styles['comments']}>
                {comments && comments.length > 0 ? (
                    comments.map(comment =>
                        <>
                            <div
                                className={styles['comment']}
                                key={comment.id}
                            >
                                {comment.body}
                            </div>
                        </>
                    )
                ) : (
                    tempComments.map(val => (
                        <div
                            className={styles['comment']}
                            key={val}
                        >
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis tenetur eligendi rerum iusto, perspiciatis repellendus, molestias maxime nesciunt rem sed optio? Officia, saepe.
                        </div>
                    ))
                )}
            </div>
        </section>
    )
}