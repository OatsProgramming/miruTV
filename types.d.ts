type FavId = {
    animeId: string,
    lastVisit: string
}

// Request Related (START)
type FavIdsRequest = {
    favId?: FavId,
    newFavIds?: FavId[]
}

type WatchHistoryId = {
    epId: string,
    epTitle: string,
    animeTitle: string,
    img: string,
    lastWatched: number
}

type WatchHistoryIdRequest = Partial<WatchHistoryId> | {
    newWatchHistoryIds?: WatchHistoryId[],
}

type UserRequest = {
    username: string,
    password: string,
    newInfo?: {
        username?: string,
        password?: string
    }
}

type CommentRequest = {
    commentId?: string,
    body?: string,
    epId?: string,
    repliedTo?: string
}

type RequestBody<T> = {
    data: T,
    method: Exclude<Method, 'GET'>
}

// Request Related (END)

type UrlStore = {
    url: string,
    setUrl: (url: UrlStore['url']) => void,
}

type Sesh = {
    user: {
        id: string
    }
}


type Param = {
    params: {
        [key: string]: string
    }
}

type ParamsArr = {
    params: {
        slug: string[]
    }
}

type InfoCard = {
    /**
     * Use 777 (number) if planning to use an "Empty" Card
     */
    animeId: string | 777,
    animeTitle: string,
    coverImg?: string | null,
}

type EpCardRequirments = {
    title: string,
    number: number,
    epId: string,
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

// Toast
type ToastType = 'info' | 'warning' | 'error' | 'success'

type NotifyParams = {
    type: ToastType,
    message: string,
} | {
    type: 'promise',
    messages: {
        pending: string,
        success: string,
        error: string,
    },
    promise: Promise<any>
}

type NotifyReturnType = Record<ToastType, string | number> & {
    promise: Promise<Response>
}

type CommentsSectionParam = {
    param: { epId: string } | { commentId: string }
}

type Email = {
    email: string,
    name: string,
    message: string,
}

type EmailPartial = Partial<Email>

type Action = {
    e?: Event,
    type: 'sending' | 'updating' | 'deleting',
    newInfo?: EmailPartial,
    form?: HTMLFormElement | null,
}