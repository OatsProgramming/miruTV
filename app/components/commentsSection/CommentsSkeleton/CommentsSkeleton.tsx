import type { CSSProperties } from 'react'
import styles from './commentsSkeleton.module.css'

function CommentsSkeleton() {
    const tempComments = [1, 2, 3, 4, 5]

    return (
        <div className={styles['comments']}>
            {tempComments.map((val, idx) => (
                <div className={styles['comment']} key={val} style={{
                    '--delay': idx
                } as CSSProperties}>
                    <div className={styles['line']} />
                    <div className={styles['line']} />
                    <div className={styles['line']} />
                </div>
            ))}
        </div>
    )
}

export default CommentsSkeleton
