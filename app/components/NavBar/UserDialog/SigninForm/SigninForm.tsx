import toggleDialog from '@/lib/toggleDialog';
import styles from './signinForm.module.css'
import type { RefObject, FormEvent } from "react";
import { useState } from 'react'
import signInUser from './signInUser'
import { useRouter } from 'next/navigation'

export default function SigninForm({ dialogRef }: {
    dialogRef: RefObject<HTMLDialogElement>
}) {
    const [isNew, setIsNew] = useState(false)

    return (
        <>
            <div className={styles['details']}>
                <span className={styles['textOne']}>
                    <h1>What's stored?</h1>
                    <ul>
                        <li>Username</li>
                        <li>Password</li>
                        <li>And your favorited animes</li>
                    </ul>
                </span>
                <span className={styles['textTwo']}>
                    <div>No cookies. No tracking. Just anime.</div>
                    <div><i>For privacy, please don't use your email as a username. But hey, I'm not your dad.</i></div>
                </span>
            </div>
            <form onSubmit={(e) => signInUser(e, isNew)} className={styles['form']}>
                <img
                    loading='lazy'
                    src='https://i.imgur.com/8afeTcs.png'
                    alt=''
                />
                <div className={styles['textField']}>
                    <input type="text" name='username' placeholder="" required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className={styles['textField']}>
                    <input type="password" name='password' placeholder="" required />
                    <label htmlFor="password">Password</label>
                </div>
                {isNew && (
                    <div className={styles['textField']}>
                        <input type="password" name='confirm' placeholder="" required />
                        <label htmlFor="confirm">Confirm Password</label>
                    </div>
                )}
                <div className={styles['btns']}>
                    <button onPointerDown={(e) => toggleDialog(e, dialogRef)}>
                        Cancel
                    </button>
                    <button>
                        {isNew ? 'Create Account' : 'Sign In'}
                    </button>
                </div>
                <button onPointerDown={() => setIsNew(!isNew)}>
                    {isNew ? 'Have an acccount?' : 'New here?'}
                </button>
            </form>
        </>
    )
}