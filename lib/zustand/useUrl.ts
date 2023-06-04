import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * To ensure signing out works anywhere in the site. With NextAuth, user can't sign out
 * unless they signed out from the same url they've signed in (if they go to another page then go back
 * to that page, it won't work.)
 */
const useUrl = create<UrlStore>()(
    persist((set) => ({
        url: '',
        setUrl: (url) => set({ url })
    }), {
        name: 'url-store',
        // Make sure store gets deleted as soon as client closes
        storage: createJSONStorage(() => sessionStorage)
    })
)

export default useUrl