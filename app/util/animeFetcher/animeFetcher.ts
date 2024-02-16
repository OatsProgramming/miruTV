import baseUrl from "@/app/util/baseUrl"

// TODO: Find a way to incorporate ISR w/o having issues w/ vercel's automatic caching
export default async function animeFetcher<AnimeRouteT extends AnimeRoute>(
  route: AnimeRouteT,
  revalidate?: number
): Promise<AnimeReturnTypes[AnimeRouteT['route']] | undefined> {

  revalidate = revalidate || 0

  try {
    const routeArr = Object.values(route)
    const joinedRoute = routeArr.join('/')
    // For some reason, fetch sometimes need the domain and sometimes it doesnt...?
    const url =
      baseUrl
      + '/api/anime/'
      + joinedRoute

    // Its still using stale data????????
    const res = await fetch(url, { next: { revalidate } })

    if (!res.ok) {
      const result = await res.text()
      console.error(result)
      return
    }
    return res.json()
  } catch (err) {
    console.error(err)
  }
}