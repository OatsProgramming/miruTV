export default async function getAnilistInfo(url: string) {
    // Check w/o a provider first
    const providerArr = ['', '9anime', 'animefox', 'animepahe', 'bilibili', 'crunchyroll', 'gogoanime', 'marin', 'zoro']

    const promiseArr = providerArr.map(async provider => {
        const newUrl = provider ? `${url}?provider=${provider}` : url
        const res = await fetch(newUrl, { next: { revalidate: 0 } })

        if (!res.ok) return Promise.reject('Failed to fetch anilist info')

        else return res.json()
    })

    return Promise.any(promiseArr)
}