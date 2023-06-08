import SignOut from "@/app/components/AuthBtns/SignOut"
import toggleDialog from "@/lib/toggleDialog"
import isEqual from "lodash/isEqual"
import { memo } from "react"
import type { RefObject } from 'react'
import styles from './userForm.module.css'
import type { Session } from "next-auth"
import FavSect from "@/app/components/AnimeSect/FavSect"

function userForm({ session, dialogRef }: {
    session: Session
    dialogRef: RefObject<HTMLDialogElement>
}) {

    return (
        <div className={styles['container']}>
            <div className={styles['text']}>
                <h1>
                    Sup, <span className={styles['username']}>
                        {session.user.name}
                    </span>.
                </h1>
                <p>We got your favs saved for you:</p>
            </div>
            <div className={styles['animes']}>
                {/* @ts-expect-error */}
                <FavSect session={session}/>
            </div>
            <div className={styles['btnContainer']}>
                <button onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                    </svg>
                    <div>Edit</div>
                </button>
                <SignOut dialogRef={dialogRef}/>
                <button onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                    <div>Close</div>
                </button>
            </div>
        </div>
    )
}

const UserForm = memo(userForm, (prev, next) => {
    return isEqual(prev, next)
})

export default UserForm