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
    const res = await fetch(`http://localhost:3000/api/enime/${joinedRoute}`)

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