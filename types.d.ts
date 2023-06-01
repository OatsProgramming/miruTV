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

type UrlStore = {
    url: string,
    setUrl: (url: UrlStore['url']) => void,
}

type Sesh = {
    user: {
        id: string
    }
}


// Enime API Types (START)

// Gen
type TitleVariationsSML = {
    native: string,
    english: string,
}

type TitleVariantionsXL = TitleVariationsSML & {
    "userPreferred": string
    "romaji": string,
}

type Mappings = {
    "mal": number,
    "anidb": number,
    "kitsu": number,
    "anilist": number,
    "thetvdb": number,
    "anisearch": number,
    "livechart": number,
    "notify.moe": string,
    "anime-planet": string
}

type AnimeXL = {
    "id": string,
    "slug": string,
    "anilistId": number,
    "coverImage": string,
    "bannerImage": string,
    "status": string,
    "season": string,
    "title": TitleVariantionsXL
    "mappings": Mappings,
    "currentEpisode": 9,
    "next": string,
    "synonyms": string[],
    "countryOfOrigin": string,
    "lastEpisodeUpdate": string,
    "seasonInt": number,
    "description": string,
    "duration": number,
    "averageScore": number,
    "popularity": number,
    "color": string,
    "year": number,
    "createdAt": string,
    "updatedAt": string,
    "format": string,
    "lastChecks": {
        "clfrxh9h51slsluksocdfxs09": number,
        "clfrxh9le1sluluks7p0eduer": number
    },
    "genre": string[]
}

type AnimeSML = Pick<AnimeXL, 'id' | 'slug' | 'title' | 'genre' | 'mappings' | 'bannerImage' | 'coverImage'> & {
    episodes: AnimeEpisode[]
}

type AnimeMetaData = {
    "total": number,
    "lastPage": number,
    "currentPage": number,
    "perPage": number,
    "prev": number,
    "next": number
}

type AnimeSourcePlain = {
    "id": string,
    "website": string,
    "url": string,
    "priority": number,
    "subtitle": boolean
}

type AnimeRecent = AnimeEpisode & {
    sources: AnimeSourcePlain
}

type AnimeRecent = {
    "id": string,
    "anime": AnimeXL,
    "number": number,
    "title": string,
    "titleVariations": TitleVariationsSML
    "description": string,
    "image"?: string,
    "airedAt": string,
    "sources": AnimeSourcPlain[]
}

type AnimeEpisode = {
    id: string,
    animeId: string,
    number: number,
    title: string,
    titleVariations: TitleVariationsSML,
    description: string,
    image?: string,
    airedAt: string,
    createdAt: string,
}

// API
type EnimeRecent = {
    "data": AnimeRecent[],
    "meta": AnimeMetaData
}

type EnimeMapping = AnimeXL & {
    episodes: 
        (Exclude<AnimeEpisode, 'anime' | 'createdAt' | 'titleVariations' | 'animeId'>) & 
        (Pick<AnimeSourcePlain, 'id'> & { target: string })
}

type EnimeSearch = Pick<EnimeRecent, 'meta'> & {
    data: AnimeXL
}

type EnimePopular = AnimeXL[]

type EnimeEpisode = AnimeRecent & {
    anime: AnimeSML,
    createdAt: string
}

type EnimeView = EnimeEpisode

type EnimeAnime = Exclude<AnimeRecent, 'anime'>[]

type EnimeSourceHSL = {
    "id": string,
    "url": string,
    "referer": string,
    "priority": number,
    "browser": boolean,
    "website": string
}
// Enime API Types (END)