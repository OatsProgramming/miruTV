import animeToy from "@/lib/toyData/animeToy";
import episodeToy from "@/lib/toyData/episodeToy";
import mappingToy from "@/lib/toyData/mappingToy";
import popularToy from "@/lib/toyData/popular";
import recentsToy from "@/lib/toyData/recentsToy";
import searchToy from "@/lib/toyData/searchToy";
import { sourceToy, sourceToy2 } from "@/lib/toyData/sourceToy";
import viewToy from "../toyData/viewToy";
import thisUrl from "../thisUrl";

/**
 * EnimeRouteT is basically just EnimeRoute. Just need it for EnimeReturnTypes mapping
 * (NOTE: CURRENTLY RETURNING TOY DATA. CHANGE THIS ONCE READY TO DEPLOY.)
 * @param route 
 * @returns 
 */
export default async function enimeFetcher<EnimeRouteT extends EnimeRoute>(
  route: EnimeRouteT
): Promise<EnimeReturnTypes[EnimeRouteT['route']] | undefined> {

  // // Simply toy fn / data; ignore 
  // switch (route.route) {
  //   // @ts-ignore
  //   case 'anime': return animeToy;
  //   // @ts-ignore
  //   case 'episode': return episodeToy;
  //   // @ts-ignore
  //   case 'mapping': return mappingToy;
  //   // @ts-ignore
  //   case 'popular': return popularToy;
  //   // @ts-ignore
  //   case 'recent': return recentsToy;
  //   // @ts-ignore
  //   case 'search': return searchToy;
  //   case 'source': {
  //     // @ts-ignore
  //     if (route.arg === 'test') return sourceToy2
  //     // @ts-ignore
  //     else return sourceToy
  //   }
  //   // @ts-ignore
  //   case 'view': return viewToy;
  //   // @ts-ignore
  //   default: return
  // }

  try {
    const routeArr = Object.values(route)
    const joinedRoute = routeArr.join('/')
    // For some reason, fetch sometimes need the domain and sometimes it doesnt...?
    const url =
      thisUrl
      + '/api/enime/'
      + joinedRoute

    const res = await fetch(url, { cache: 'no-store' })

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