import type { Comment } from "@prisma/client";
import { createContext, useContext } from "react";

const CommentContext = createContext<Comment | null>(null)

export default function CommentProvider({ comment, children }: {
    comment: Comment,
    children: React.ReactNode
}) {
    return (
        <CommentContext.Provider value={comment}>
            {children}
        </CommentContext.Provider>
    )
}

export function getCommentContext() {
    return useContext(CommentContext)
}