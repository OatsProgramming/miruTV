import animeFetcher from "../animeFetcher/animeFetcher";

export default async function getAnimeInfo(title: string) {

    // Some titles are too long to search
    // Causes third party API to not work properly. Take only whats necessary from title
    const strArr = title.split(" ")
    strArr.splice(4, strArr.length)
    const shortTitle = strArr.join(" ")

    // adding this for caching (more details in anime api endpoint)
    const q = "SEARCH: " + shortTitle
    const search = await animeFetcher({ route: 'search', arg: q })
    const anime = search?.results[0]
    
    if (!anime) throw new Error("Anime not found (Trying to get episodes)")

    const animeInfoPromise = animeFetcher({ route: 'info', arg: anime.id })
    return animeInfoPromise
}