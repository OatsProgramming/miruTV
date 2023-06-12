import SignOut from "@/app/components/AuthBtns/SignOut"
import toggleDialog from "@/lib/toggleDialog"
import { useState } from 'react'
import styles from './userForm.module.css'
import type { Session } from "next-auth"
import dynamic from "next/dynamic"
import type { RefObject, FormEvent, PointerEvent } from 'react'
import styles2 from '../SigninForm/signinForm.module.css'
import mutateUser from "./mutateUser"
import { useSession } from 'next-auth/react'
import { useRouter } from "next/router"

{/* @ts-expect-error */ }
const FavSect = dynamic(() =>
    import("@/app/components/FavSect/FavSect")
)

export default function UserForm({ session, dialogRef }: {
    session: Session
    dialogRef: RefObject<HTMLDialogElement>
}) {
    const { update } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(true)
    // const router = useRouter()

    function toggleUpdate(e: PointerEvent) {
        e.preventDefault()
        setIsUpdating(!isUpdating)
    }
    async function handleMuate(e: FormEvent) {
        const res = await mutateUser(e, isUpdating)
        
        // If anything returned, then the user has updated their username
        // -> update sesh
        if (typeof res === 'string') {
            console.log(res)
            // For some reason, getting a string number
            if (isFinite(+res)) return

            await update({ name: res })  

            // reload the page to show current data
            window.location.reload()
        }
    }

    return (
        <div className={styles['container']}>
            {isEditing ? (
                <>
                    <form onSubmit={handleMuate} className={styles2['form']}>
                        <div className={styles2['textField']}>
                            <input type="text" name='username' placeholder="" required />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className={styles2['textField']}>
                            <input type="password" name='password' placeholder="" required />
                            <label htmlFor="password">Password</label>
                        </div>
                        {isUpdating && (
                            <>
                                <div className={styles2['textField']}>
                                    <input type="text" name='newUsername' placeholder="" />
                                    <label htmlFor="username">New Username?</label>
                                </div>
                                <div className={styles2['textField']}>
                                    <input type="password" name='newPassword' placeholder="" />
                                    <label htmlFor="password">New Password?</label>
                                </div>
                            </>
                        )}
                        <button>
                            {isUpdating ? 'Update' : 'Delete'}
                        </button>
                        <button onPointerDown={toggleUpdate}>
                            {isUpdating ? 'Deleting Your Account?' : 'Updating Your Account?'}
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <div className={styles['text']}>
                        <h1>
                            Sup, <span className={styles['username']}>
                                {session.user.name}
                            </span>.
                        </h1>
                        <p>We got your favs saved for you:</p>
                    </div>
                    <div className={styles['animes']}>
                        <FavSect session={session} />
                    </div>
                </>
            )}
            <div className={styles['btnContainer']}>
                <button onPointerDown={() => setIsEditing(!isEditing)}>
                    {!isEditing ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                            </svg>
                            <div>Edit</div>
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                            </svg>
                            <div>Cancel</div>
                        </>
                    )}
                </button>
                <SignOut dialogRef={dialogRef} />
                <button onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                    <div>Close</div>
                </button>
            </div>
        </div>
    )
}