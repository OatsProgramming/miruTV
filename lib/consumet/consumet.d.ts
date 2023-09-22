// Source
type IVideo = {
	"url": string
	"isM3U8": boolean,
	"quality": string
}
type ISource = {
	headers?: { [k: string]: string };
	intro?: Intro;
	subtitles?: ISubtitle[];
	sources: IVideo[];
	download?: string;
	embedURL?: string;
}
type ISubtitle = {
	/**
	 * The id of the subtitle. **not** required
	 */
	id?: string;
	/**
	 * The **url** that should take you to the subtitle **directly**.
	 */
	url: string;
	/**
	 * The language of the subtitle
	 */
	lang: string;
}

// Trending | Search | Popular
type IAnimeResult = {
	id: string;
	title: string | ITitle;
	url?: string;
	image?: string;
	cover?: string;
	status?: string;
	rating?: number;
	type?: MediaFormat;
	releaseDate?: string;
	[x: string]: any; // other fields
}
type ITitle = {
	romaji?: string;
	english?: string;
	native?: string;
	userPreferred?: string;
}
type ISearch<T> = {
	currentPage?: number;
	hasNextPage?: boolean;
	totalPages?: number;
	/**
	 * total results must include results from all pages
	 */
	totalResults?: number;
	results: T[];
}

// Info
interface IAnimeInfo extends IAnimeResult {
	malId?: number | string;
	genres?: string[];
	description?: string;
	status?: string;
	totalEpisodes?: number;
	/**
	 * @deprecated use `hasSub` or `hasDub` instead
	 */
	subOrDub?: string;
	hasSub?: boolean;
	hasDub?: boolean;
	synonyms?: string[];
	/**
	 * two letter representation of coutnry: e.g JP for japan
	 */
	countryOfOrigin?: string;
	isAdult?: boolean;
	isLicensed?: boolean;
	/**
	 * `FALL`, `WINTER`, `SPRING`, `SUMMER`
	 */
	season?: string;
	studios?: string[];
	color?: string;
	cover?: string;
	trailer?: Trailer;
	episodes?: IAnimeEpisode[];
	startDate?: string;
	endDate?: string;
	recommendations?: IAnimeResult[];
	relations?: IAnimeResult[];
}
type Trailer = {
	id: string;
	site?: string;
	thumbnail?: string;
}
type IAnimeResult = {
	id: string;
	title: string | ITitle;
	url?: string;
	image?: string;
	cover?: string;
	status?: string;
	rating?: number;
	type?: string;
	releaseDate?: string;
	[x: string]: any; // other fields
}

type IAnimeEpisode = {
	id: string;
	number: number;
	title?: string;
	description?: string;
	isFiller?: boolean;
	url?: string;
	image?: string;
	releaseDate?: string;
	[x: string]: unknown; // other fields
}