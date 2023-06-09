'use client'

import { useRef } from "react";
import styles from './userDialog.module.css'
import { ToastContainer } from "react-toastify";
import { toastOptions } from "@/lib/toast/toast";
import dynamic from "next/dynamic";
import toggleDialog from "@/lib/toggleDialog";
import type { Session } from "next-auth";
import DialogProvider from "../../DialogProvider.tsx/DialogProvider";

const SigninForm = dynamic(() =>
    import("./SigninForm/SigninForm")
)

const UserForm = dynamic(() =>
    import("./UserForm/UserForm")
)

export default function UserDialog({ session }: {
    session?: Session
}) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    return (
        <>
            <button className={styles['btn']} onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="23" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                </svg>
                <div>
                    {session ? session.user.name : 'Sign in'}
                </div>
            </button>
            <dialog ref={dialogRef} className={styles['container']}>
                <DialogProvider dialogRef={dialogRef}>
                    {session ?
                        <UserForm dialogRef={dialogRef} session={session} /> :
                        <SigninForm dialogRef={dialogRef} />
                    }
                </DialogProvider>
                <ToastContainer {...toastOptions} />
            </dialog>
        </>
    )
}