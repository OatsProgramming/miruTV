type AnimeReturnTypes = {
    recents: AnimeRecentsResult,
    popular: AnimePopularResult,
    info: AnimeInfoResult,
    search: AnimeSearchResult,
    source: AnimeSourcesResult
}

type AnimeRoute = {
    route: 'recents' | 'popular'
} | {
    route: 'info' | 'search' | 'source',
    arg: string
}
