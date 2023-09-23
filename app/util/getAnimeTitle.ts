export default function getAnimeTitle(arg: AnimeInfoResult['title'] | undefined) {
    if (!arg) return "N/A"
    return typeof arg === 'string'
        ? arg
        : arg.english ?? arg.native ?? arg.userPreferred ?? 'N/A'
}