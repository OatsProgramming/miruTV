export default function getAnimeTitle(arg: AnimeInfoResult['title']) {
    return typeof arg === 'string'
        ? arg
        : arg.english ?? arg.native ?? arg.userPreferred ?? 'N/A'
}