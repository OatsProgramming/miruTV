export default function getAnimeTitle(arg: AnimeInfoResult['title'] | undefined, preference?: keyof ITitle): string {
    if (!arg) return "N/A"

    // ik ik...
    // @ts-ignore
    return typeof arg === 'string'
        ? arg
        : preference 
            ? arg[preference]
            : arg.english ?? arg.romaji ?? arg.native ?? arg.userPreferred ?? 'N/A'
}