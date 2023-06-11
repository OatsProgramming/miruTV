'use client'

import styles from './comment.module.css'
import { memo, useRef, useState } from "react"
import mutatingFetcher from "@/lib/fetchers/mutatingFetcher"
import notify from "@/lib/toast/toast"
import useComments from "../hooks/useComments"
import dynamic from "next/dynamic"
import { getCommentContext } from '../CommentProvider/CommentProvider'

const EditComment = dynamic(() => 
    import('../EditComment/EditComment')
)

const CommentContent = dynamic(() => 
    import('../CommentContent/CommentContent')
)

function commentComp({ epId }: {
    epId: string
}) {
    const [isEditing, setIsEditing] = useState(false)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const { refreshComments } = useComments(epId)
    const comment = getCommentContext()
    if (!comment) throw new Error('Comment is null')

    const mutateComment = (newBody?: string) => {
        let action: Method = 'DELETE'
        let req: CommentRequest = {
            commentId: comment.id
        }

        if (newBody) {
            const text = newBody.trim()
            if (!text) return
            req.body = text
            action = 'PATCH'
        }

        mutatingFetcher('/api/comments', action, req)
            // If anything goes wrong (thats not dev related) let user know
            // Dont forget to revalidate the data
            .then(res => 'message' in res
                ? notify({ type: 'error', message: res.message })
                : refreshComments()
            )
            .catch(err => console.error(err))

        // Clean up
        dialogRef.current?.close()
        isEditing && setIsEditing(false)
    }

    return (
        <div className={styles['container']}>
            <div className={styles['comment']}>
                {isEditing ? (
                    <EditComment
                        textareaRef={textareaRef}
                        setIsEditing={setIsEditing}
                        mutateComment={mutateComment}
                    />
                ) : (
                    <CommentContent
                        dialogRef={dialogRef}
                        setIsEditing={setIsEditing}
                        mutateComment={mutateComment}
                    />
                )}
            </div>
        </div >
    )
}

const CommentComp = memo(commentComp, (prev, next) => {
    return prev.epId === next.epId
})

export default CommentComp

