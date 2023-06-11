import AddComment from './addComment/AddComment'
import styles from './commentsSection.module.css'
import CommentsComp from './CommentsComp/CommentsComp'

export default function CommentsSection({ epId }: {
    epId: string
}) {    
    return (
        <section id='commentsSection' className={styles['commentsSection']}>
            <AddComment epId={epId}/>
            <CommentsComp epId={epId}/>
        </section>
    )
}
