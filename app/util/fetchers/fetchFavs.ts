import baseUrl from "../baseUrl"

export default async function fetchFavs(favIds: FavId[]) {
    if (!favIds || favIds.length === 0) return
    const responsesPromises: Promise<Response>[] = []
    for (let i = 0; i < favIds.length; i++) {
        responsesPromises.push(
            fetch(`${baseUrl}/api/anime/info/${favIds[i].animeId}`)
        )
    }

    const responses = await Promise.allSettled(responsesPromises)
    const resultPromises: Promise<any>[] = []

    for (const response of responses) {
        if (response.status === 'fulfilled') {
            resultPromises.push(response.value.json())
        }
        else {
            console.log(response.reason)
        }
    }

    return Promise.all(resultPromises) as Promise<AnimeInfoResult[]>
}