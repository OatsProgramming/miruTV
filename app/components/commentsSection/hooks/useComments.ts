'use client'
import useSWR, { useSWRConfig } from 'swr'
import type { Comment } from '@prisma/client'
import fetcher from '@/app/util/fetchers/fetcher'

export default function useComments(epId: string) {
    const { data, error, isLoading } = useSWR(`/api/comments?epId=${epId}`, fetcher)
    // Regular mutate causes session to act weird for some reason
    const { mutate } = useSWRConfig()

    return {
        comments: data as Comment[],
        error,
        isLoading,
        refresh: () => mutate(`/api/comments?epId=${epId}`)
    }
}