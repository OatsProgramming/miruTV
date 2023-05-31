'use client'

import { User } from "@prisma/client";
import { FormEvent } from "react";

export default function SignUp() {

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        const data = {
            username: formData.get('username'),
            password: formData.get('password')
        } as UserRequest
        
        try {
            const res = await fetch('/api/user', {
                method: 'DELETE',
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

            const result = await res.text()
            console.log(result)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">
                <input type="text" name='username'/>
            </label>
            <label htmlFor="password">
                <input type="password" name='password'/>
            </label>
            <button>
                Submit
            </button>
        </form>
    )
}