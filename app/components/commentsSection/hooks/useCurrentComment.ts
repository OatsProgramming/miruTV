'use client'

import type { Comment } from '@prisma/client'
import { create } from 'zustand'

type CurrentCommentStore = {
    /**
     * To be used to determine if in the replies section
     */
    currentComment: Comment | null, 
    prevComments: Comment[],
     /**
     * If planning to go to return main, use goBackMain for ease
     */
    setCurrentComment: (currentComment: Comment | null) => void,
    goBackOne: () => void,
    goBackMain: () => void
}

// It seems that normal array/obj manipulation works fine here...
// Perhaps its bc im still setting state...?
const useCurrentComment = create<CurrentCommentStore>()((set, get) => ({
    currentComment: null,
    prevComments: [],
    // Push works here too
    setCurrentComment: (currentComment) => {
        set(state => {
            const idx = currentComment
                ? state.prevComments.push(currentComment) - 1
                : 0
            return { currentComment: state.prevComments[idx] }
        })
    },
    // Pop works perfectly here (no need to make a new array and update prevComments)
    goBackOne: () => set(state => ({ currentComment: state.prevComments.pop() })),
    goBackMain: () => set({ currentComment: null, prevComments: [] })
}))

export default useCurrentComment