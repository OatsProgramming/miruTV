import notify from "@/lib/toast/toast"
import { signIn } from "next-auth/react"
import { FormEvent } from "react"

export default async function handleSubmit(e: FormEvent, isNew: boolean) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data: UserRequest = {
        username: formData.get('username'),
        password: formData.get('password'),
    } as UserRequest

    // For new users
    if (isNew) {
        // Make sure they typed the desired pw right
        const confirmPassword = formData.get('confirm')
        if (data.password !== confirmPassword) {
            return notify({
                type: 'error',
                message: `The passwords don't match...`
            })
        }

        try {
            // Create user
            const res = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data, method: 'POST' })
            })


            if (!res.ok) {
                const result = await res.text()
                console.error(result)
                
                let message = "Server Error"
                if (result.includes("Unique constraint")){
                    message = "User already exists"
                }
                
                // Notify user what went wrong
                return notify({
                    type: 'error',
                    message
                })
            }

            // Let user know creation is complete
            notify({
                type: 'success',
                message: 'User created'
            })
        } catch (err) {
            console.error(err)
            return
        }
    }

    // Let user know sign in executing
    notify({
        type: 'info',
        message: 'Signing in...'
    })

    signIn('credentials', {
        username: data.username,
        password: data.password
    })
        .catch((err: Error) => {
            console.error(err)
            notify({
                type: 'error',
                message: "Failed to sign in"
            })
        })
}