/* 
( Assuming animeId is gogo based )
    The following example :
    @param sousou-no-frieren-no-mahou-episode-1
    @result sousou-no-frieren-no-mahou
*/
export default function getAnimeId(str: string) {
    const i = str.indexOf("-episode")
    return str.slice(0, i)
}