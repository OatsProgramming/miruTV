type AnimeCategory = 'search' | 'info' | 'source' | 'recents' | 'popular' | 'trending'

// Using anilist
type AnimeSearchResult = ISearch<IAnimeResult[]>
type AnimeInfoResult = ISearch<IAnimeResult[]>
type AnimeTrendingResult = ISearch<IAnimeResult[]>
type AnimePopularResult = ISearch<IAnimeResult[]>

// Using gogo
type AnimeSourcesResult = ISource
type AnimeRecentsResult = {
	"currentPage": number,
	"hasNextPage": boolean,
	"results": AnimeRecent[]
}
type AnimeRecent = {
    "id": string
    "episodeId": string
    "episodeNumber": number
    "title": string
    "image": string
    "url": string
}