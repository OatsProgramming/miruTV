'use client'

import { FormEvent, MouseEvent, useRef } from "react";
import styles from './signUp.module.css'
import { signIn } from "next-auth/react";

async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data: UserRequest = {
        username: formData.get('username'),
        password: formData.get('password'),
    } as UserRequest

    try {
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            const result = await res.text()
            console.log(result)
            return
        }

        // sign in user automatically if successful
        signIn('credentials', {
            username: data.username,
            password: data.password
        })
    } catch (err) {
        console.error(err)
    }
}


export default function SignUp() {
    const dialogRef = useRef<HTMLDialogElement>(null)

    function toggleDialog(e: MouseEvent) {
        // Prevent accidental submission
        e.preventDefault()

        const dialog = dialogRef.current
        if (!dialog) return
        else if (dialog.open) dialog.close()
        else dialog.showModal()
    }

    return (
        <>
            <button onPointerDown={toggleDialog}>
                Sign Up
            </button>
            <dialog ref={dialogRef} className={styles['container']}>
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
                <form onSubmit={handleSubmit} className={styles['form']}>
                    <img
                        loading='lazy'
                        src='https://i.imgur.com/8afeTcs.png'
                        alt=''
                    />
                    <div className={styles['textField']}>
                        <input type="text" name='username' placeholder="" required/>
                        <label htmlFor="username">Username</label>
                    </div>
                    <div className={styles['textField']}>
                        <input type="password" name='password' placeholder="" required/>
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className={styles['btns']}>
                        <button onPointerDown={toggleDialog}>
                            Cancel
                        </button>
                        <button>
                            Submit
                        </button>
                    </div>
                </form>
            </dialog>
        </>
    )
}