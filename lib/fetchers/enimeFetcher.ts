/**
 * EnimeRouteT is basically just EnimeRoute. Just need it for EnimeReturnTypes mapping
 * @param route 
 * @returns 
 */
export default async function enimeFetcher<EnimeRouteT extends EnimeRoute>(
  route: EnimeRouteT
): Promise<EnimeReturnTypes[EnimeRouteT['route']] | undefined> {

  try {
    const routeArr = Object.values(route)
    const joinedRoute = routeArr.join('/')
    // For some reason, fetch sometimes need the domain and sometimes it doesnt...?
    const url =
      'http://localhost:3000'
      + '/api/enime/'
      + joinedRoute

    const res = await fetch(url)

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