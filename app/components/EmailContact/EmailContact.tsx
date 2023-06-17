'use client'

import contactReducer from '@/lib/reducerFns/contactReducer'
import { useReducer, useRef } from 'react'
import styles from './emailContact.module.css'
import { ToastContainer } from 'react-toastify'
import { toastOptions } from '@/lib/toast/toast'

// Reusing old code

// Attempt to make mobile v more enjoyable
function handleClick(e: React.PointerEvent) {
    const formEl = e.target as HTMLInputElement | HTMLTextAreaElement
    formEl.focus()
}

export default function EmailContact() {
    const [, dispatch] = useReducer(contactReducer, {} as Email)
    const formRef = useRef<HTMLFormElement>(null)

    return (
        <>
            <form ref={formRef} className={styles['form']}>
                <div className={styles['textField']}>
                    <input required type="email" id="email" name='email' placeholder=""
                        onChange={(e) => dispatch({
                            type: 'updating',
                            newInfo: { email: e.target.value }
                        })}
                    />
                    <label htmlFor="email">Email</label>
                </div>
                <div className={styles['textField']}>
                    <input type="text" id='name' name='name' placeholder=""
                        onChange={(e) => dispatch({
                            type: 'updating',
                            newInfo: { name: e.target.value }
                        })}
                    />
                    <label htmlFor="name">Name</label>
                </div>
                <textarea className={styles['textarea']} id='message' placeholder='' required
                        onChange={(e) => dispatch({
                            type: 'updating',
                            newInfo: { message: e.target.value }
                        })}
                    />
                <div className={styles['btns']}>
                    <button onPointerDown={(e) => {
                        e.preventDefault()
                        dispatch({
                            type: 'deleting',
                            form: formRef.current,
                        })
                    }}>
                        Clear
                    </button>
                    <button onPointerDown={(e) => {
                        e.preventDefault()
                        dispatch({
                            type: 'sending',
                            form: formRef.current,
                        })
                    }}>
                        Send
                    </button>
                </div>
            </form>
            <ToastContainer {...toastOptions} />
        </>
    )
}