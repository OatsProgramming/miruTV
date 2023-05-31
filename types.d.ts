type Anime = {
    id: string,
    name: string,
    isSeen: boolean,
}

type UserRequest = {
    username: string,
    password: string,
    newInfo?: {
        username?: string,
        password?: string
    }
}

type UserSession = {
    username: string,
    favIds: Anime[]
}
