export default async function getAnilistInfo(url: string) {
    // Check w/o a provider first
    const providerArr = ['', '9anime', 'animefox', 'animepahe', 'bilibili', 'crunchyroll', 'gogoanime', 'marin', 'zoro']

    const promiseArr = providerArr.map(async provider => {
        const newUrl = provider ? `${url}?provider=${provider}` : url
        const res = await fetch(newUrl, { next: { revalidate: 0 } })

        if (!res.ok) return Promise.reject('Failed to fetch anilist info')

        else return res.json()
    })

    // Changed this from Promise.any to Promise.allSettled
    // Must guarantee that it does or doesnt have episodes
    const results = await Promise.allSettled(promiseArr)
    const re = results.find(src => {
        if (src.status === 'rejected') return 0
        else if ((src.value as IAnimeInfo).episodes?.length === 0) return 0

        return true
    }) as { status: 'fulfilled', value: IAnimeInfo } | undefined

    return re 
        ? re.value
        : null
}