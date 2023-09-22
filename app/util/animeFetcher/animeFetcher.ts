import baseUrl from "@/app/util/baseUrl"

/**
 * EnimeRouteT is basically just EnimeRoute. Just need it for EnimeReturnTypes mapping
 * @param route 
 * @returns 
 */
export default async function animeFetcher<AnimeRouteT extends AnimeRoute>(
  route: AnimeRouteT
): Promise<AnimeReturnTypes[AnimeRouteT['route']] | undefined> {

  try {
    const routeArr = Object.values(route)
    const joinedRoute = routeArr.join('/')
    // For some reason, fetch sometimes need the domain and sometimes it doesnt...?
    const url =
      baseUrl
      + '/api/anime/'
      + joinedRoute

    // Its still using stale data????????
    const res = await fetch(url, { next: { revalidate: 0 } })

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