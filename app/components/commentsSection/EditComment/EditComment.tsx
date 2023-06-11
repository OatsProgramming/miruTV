import { RefObject, useState } from "react"
import { getCommentContext } from "../CommentProvider/CommentProvider"
import { commentMaxChar } from "../addComment/AddComment"
import styles from './editComment.module.css'

export default function EditComment({ textareaRef, setIsEditing, mutateComment }: {
    textareaRef: RefObject<HTMLTextAreaElement>,
    setIsEditing: (arg: boolean) => void,
    mutateComment: (newBody?: string) => void
}) {
    const comment = getCommentContext()
    const [commentBody, setCommentBody] = useState(comment?.body ?? '')

    const handleCancel = () => {
        if (!comment) return
        if (comment.body !== commentBody) setCommentBody(comment.body)
        setIsEditing(false)
    }

    return (
        <div className={styles['onEdit']}>
            <textarea
                ref={textareaRef}
                value={commentBody}
                onChange={(e) => setCommentBody(e.target.value)}
                className={styles['editComment']}
                placeholder={comment?.body}
                maxLength={commentMaxChar}
                spellCheck
            />
            <div className={styles['btnContainer']}>
                <button data-http-method="PATCH" onPointerDown={() => mutateComment(commentBody)}>
                    Save
                </button>
                <button onPointerDown={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}