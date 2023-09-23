import mutatingFetcher from "@/app/util/fetchers/mutatingFetcher"
import notify from "@/lib/toast/toast"
import type { FormEvent } from 'react'

/**
 * If planning to update, dont forget to reload the page
 * @param e 
 * @param isUpdating 
 * @returns 
 */
export default async function mutateUser(e: FormEvent, isUpdating: boolean) {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = {
        username: formData.get('username'),
        password: formData.get('password'),
    } as UserRequest

    let action: Method = 'DELETE'
    if (isUpdating) {
        action = 'PATCH'
        const newInfo = {
            username: formData.get('newUsername'),
            password: formData.get('newPassword')
        } as UserRequest['newInfo']
        data.newInfo = newInfo
    }

    try {
        const res = await mutatingFetcher('/api/user', action, data)
        if ('message' in res) {
            notify({ type: 'error', message: res.message })
            return
        }
        const { username, newInfo } = res.data

        const message = action === 'DELETE'
            ? `${username} has been successfully deleted.`
            : `${newInfo?.username || username} has been successfully updated.`
        notify({ type: 'success', message })


        // Sign out user if deleting
        if (action === 'DELETE') {
            // lazy load signOut module
            const signOut = await import("next-auth/react").then(mod => mod.signOut)
            signOut()
                .catch(err => {
                    console.log(err)
                    notify({
                        type: 'error',
                        message: 'Failed to sign out'
                    })
                })
            return
        }
        else if (newInfo?.username) {
            // Otherwise update session (update at designated area)
            return newInfo.username
        }

    } catch (err) {
        console.log(err)
        return
    } finally {
        // Remove circular reference for garbage collection no matter the circumstances
        delete data.newInfo
    }
}