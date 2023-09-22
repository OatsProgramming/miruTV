type AnimeCategory = 'search' | 'info' | 'source' | 'servers'

// Search
type AnimeSearchResult = {
	"currentPage": number,
	"hasNextPage": boolean,
	"results": AnimeInfoBasic[]
}
type AnimeInfoBasic = {
    "id": string,
    "title": string,
    "url": string,
    "image": string,
    "releaseDate": string,
    "subOrDub": string
}


// Info
type AnimeInfoResult = {
	"id": string,
	"title": string
	"url": string
	"genres": string[]
	"totalEpisodes": number,
	"image": string
	"releaseDate": string
	"description": string
	"subOrDub": string
	"type": string
	"status": string
	"otherName": string
	"episodes": Episode[]
}
type Episode = {
    "id": string
    "number": number
    "url": string
}


// Source
type AnimeSourcesResult = {
	"headers": {
		"Referer": string
	},
	"sources": Source[]
	"download": string
}
type Source = {
    "url": string
    "isM3U8": boolean,
    "quality": string
}


// Recents
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


// Popular
type AnimePopularResult = {
    "currentPage": number,
	"hasNextPage": boolean,
	"results": Popular[]
}
type Popular = {
    "id": string,
    "title": string,
    "image": string
    "url": string
    "genres": string[]
}