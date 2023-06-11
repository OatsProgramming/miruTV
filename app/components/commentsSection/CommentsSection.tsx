import AddComment from './addComment/AddComment'
import styles from './commentsSection.module.css'
import CommentsComp from './CommentsComp/CommentsComp'

export default async function CommentsSection({ param }: CommentsSectionParam) {    
    return (
        <section id='commentsSection' className={styles['commentsSection']}>
            <AddComment param={param}/>
            <CommentsComp param={param}/>
        </section>
    )
}
