export default function getAnimeTitle(arg: AnimeInfoResult['title'] | undefined, preference?: keyof ITitle) {
    if (!arg) return "N/A"
    return typeof arg === 'string'
        ? arg
        : preference 
            ? arg[preference]
            : arg.english ?? arg.romaji ?? arg.native ?? arg.userPreferred ?? 'N/A'
}