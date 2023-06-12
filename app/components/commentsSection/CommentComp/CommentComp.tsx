'use client'

import styles from './comment.module.css'
import { memo, useRef, useState } from "react"
import mutatingFetcher from "@/lib/fetchers/mutatingFetcher"
import notify from "@/lib/toast/toast"
import dynamic from "next/dynamic"
import { getCommentContext } from '../CommentProvider/CommentProvider'
import isEqual from 'lodash/isEqual'
import useCurrentComment from '../hooks/useCurrentComment'

const EditComment = dynamic(() =>
    import('../EditComment/EditComment')
)

const CommentContent = dynamic(() =>
    import('../CommentContent/CommentContent')
)

function commentComp({ refresh }: {
    refresh: () => Promise<any>
}) {
    const { setCurrentComment } = useCurrentComment()
    const [isEditing, setIsEditing] = useState(false)
    const dialogRef = useRef<HTMLDialogElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Caution: could cause infinite reply threads. Not sure if thats user friendly
    const comment = getCommentContext() ?? useCurrentComment().currentComment
    if (!comment) throw new Error('Both current and context comments are null (CommentComp)')

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
                : refresh()
            )
            .catch(err => console.error(err))

        // Clean up
        dialogRef.current?.close()
        isEditing && setIsEditing(false)
    }
    
    return (
        <div className={styles['container']}>
            <div className='comment'>
                {isEditing ? (
                    <EditComment
                        textareaRef={textareaRef}
                        setIsEditing={setIsEditing}
                        mutateComment={mutateComment}
                    />
                ) : (
                    <CommentContent
                        inComments={{
                            dialogRef,
                            setIsEditing,
                            mutateComment
                        }}
                    />
                )}
            </div>
            <button onPointerDown={() => setCurrentComment(comment)}>
                Go to Replies
            </button>
        </div >
    )
}

const CommentComp = memo(commentComp, (prev, next) => {
    return isEqual(prev, next)
})

export default CommentComp

