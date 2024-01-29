import getAnimeTitle from "./getAnimeTitle"

/**
 * Only works from anilist info shape
 * @param animeTitle 
 * @returns 
 */
export default function toGogoId(animeTitle: IAnimeInfo['title']) {
    const title = getAnimeTitle(animeTitle, 'romaji')
    if (!title) throw new Error("Unable to get anime title")

    return title
        .toLowerCase()
        .split(' ')
        .join('-')
}