'use client'
import useSWR from 'swr'
import type { Comment } from '@prisma/client'
import fetcher from '@/lib/fetchers/fetcher'

export default function useComments(epId: string) {
    const { data, error, isLoading, mutate } = useSWR(`/api/comments?epId=${epId}`, fetcher)

    return {
        comments: data as Comment[],
        error,
        isLoading,
        mutate
    }
}