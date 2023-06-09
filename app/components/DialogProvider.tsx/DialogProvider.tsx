'use client'

import { ReactNode, RefObject, createContext, useContext } from "react"

const DialogContext = createContext<RefObject<HTMLDialogElement> | undefined>(undefined)

export default function DialogProvider({ children, dialogRef }: {
    children: ReactNode,
    dialogRef: RefObject<HTMLDialogElement>
}) {
    return (
        <DialogContext.Provider value={dialogRef}>
            {children}
        </DialogContext.Provider>
    )
}

export function getDialogContext() {
    return useContext(DialogContext)
}