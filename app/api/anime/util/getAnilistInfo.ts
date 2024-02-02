export default async function getAnilistInfo(url: string) {
    // Check w/o a provider first
    const providerArr = ['', '9anime', 'animefox', 'animepahe', 'bilibili', 'crunchyroll', 'gogoanime', 'marin', 'zoro']

    const promiseArr = providerArr.map(async provider => {
        const newUrl = provider ? `${url}?provider=${provider}` : url
        const res = await fetch(newUrl, { next: { revalidate: 0 } })

        if (!res.ok) return Promise.reject('Failed to fetch anilist info')

        const result = await res.json() as IAnimeInfo
        if (result.episodes?.length === 0) return Promise.reject('No episodes')

        return result
    })

    // Changed this from Promise.any to Promise.allSettled
    // Must guarantee that it does or doesnt have episodes
    const results = await Promise.allSettled(promiseArr)

    const result = results[0]
    return result.status === 'fulfilled' 
        ? result.value
        : null
}