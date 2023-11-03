/**
( Assuming animeId is gogo based )
The following example :
        sousou-no-frieren-no-mahou-episode-1
        sousou-no-frieren-no-mahou
 * @param episodeId
 * @returns animeId
 */
export default function epIdtoAnimeid(episodeId: string) {
    const i = episodeId.indexOf("-episode")
    return episodeId.slice(0, i)
}