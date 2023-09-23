import mutatingFetcher from "@/app/util/fetchers/mutatingFetcher"
import notify from "@/lib/toast/toast"
import { signIn } from "next-auth/react"
import type { FormEvent } from "react"

export default async function signInUser(e: FormEvent, isNew: boolean) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = {
        username: formData.get('username'),
        password: formData.get('password'),
    } as UserRequest

    if (isNew) {
        // POST
        const confirmPassword = formData.get('confirm')
        if (data.password !== confirmPassword) {
            return notify({
                type: 'error',
                message: `The passwords don't match...`
            })
        }

        try {
            // Create user
            const res = await mutatingFetcher('/api/user', 'POST', data)

            if ('message' in res) {
                let message = 'Server Error'
                if (res.message.includes('Unique constraint')) {
                    message = 'User already exists'
                }
                return notify({
                    type: 'error',
                    message
                })
            }

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

    const res = await signIn('credentials', {
        redirect: false,
        username: data.username,
        password: data.password
    })

    // res.ok will always be true for next-auth
    if (res?.error) {
        console.log(res.error)
        notify({ type: 'error', message: 'Incorrect username / password' })
    }

    // Manually reload if successful
    else window.location.reload()
}
