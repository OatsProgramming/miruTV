type AnimeCategory = 'search' | 'info' | 'source' | 'recents' | 'popular' | 'trending' 

// Anime info
type IAnimeEpisodeFiltered = Pick<IAnimeEpisode, 'id' | 'image' | 'number' | 'title'>
type IAnimeInfoFiltered = Pick<IAnimeInfo, 'id' | 'title' | 'episodes' | 'cover' | 'description' | 'image' | 'status' | 'trailer'> & { episodes: IAnimeEpisodeFiltered[] }

// Anime source
type ISourceFiltered = Pick<ISource, 'sources' | 'subtitles'>

// All others (beside recents)
type IAnimeResultFiltered = Pick<IAnimeResult, 'id' | 'title' | 'cover' | 'image'> & { description?: string }
type ISearchFiltered = Pick<ISearch<IAnimeResultFiltered>, 'results'>



// Using anilist
type AnimeSearchResult = ISearchFiltered
type AnimeTrendingResult = ISearchFiltered
type AnimePopularResult = ISearchFiltered
type AnimeInfoResult = IAnimeInfoFiltered

// Using gogo
type AnimeSourcesResult = ISourceFiltered
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