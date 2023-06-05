'use client'
import useSWR from 'swr'
import type { Comment } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function useComments(epId: string) {
    const { data, error, isLoading, mutate } = useSWR(`/api/comments?epId=${epId}`, fetcher)

    return {
        comments: data as Comment[],
        error,
        isLoading,
        mutate
    }
}