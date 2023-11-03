type AnimeReturnTypes = {
    recents: AnimeRecentsResult,
    popular: AnimePopularResult,
    info: AnimeInfoResult,
    search: AnimeSearchResult,
    source: AnimeSourcesResult,
    trending: AnimeTrendingResult,
    episodes: AnimeInfoResult
}

type AnimeRoute = {
    route: 'recents' | 'popular' | 'trending'
} | {
    route: 'info' | 'search' | 'source',
    arg: string
}
