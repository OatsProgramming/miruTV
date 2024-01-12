import animeFetcher from "../animeFetcher/animeFetcher";

export default async function getAnimeInfo(title: string) {
    // adding this for caching (more details in anime api endpoint)
    const q = "SEARCH: " + title
    const search = await animeFetcher({ route: 'search', arg: q })
    const anime = search?.results[0]
    
    if (!anime) throw new Error("Anime not found (Trying to get episodes)")

    const animeInfoPromise = animeFetcher({ route: 'info', arg: anime.id })
    return animeInfoPromise
}