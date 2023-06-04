import animeToy from "./animeToy";
import episodeToy from "./episodeToy";
import mappingToy from "./mappingToy";
import popularToy from "./popular";
import recentsToy from "./recentsToy";
import searchToy from "./searchToy";
import sourceToy from "./sourceToy";

/**
 * EnimeRouteT is basically just EnimeRoute. Just need it for EnimeReturnTypes mapping
 * @param route 
 * @returns 
 */
export default async function enimeFetcherToy<EnimeRouteT extends EnimeRoute>(
    route: EnimeRouteT
): Promise<EnimeReturnTypes[EnimeRouteT['route']] | undefined> {

    // Simply toy fn / data; ignore 
    switch (route.route) {
        // @ts-ignore
        case 'anime': return animeToy;
        // @ts-ignore
        case 'episode': return episodeToy;
        // @ts-ignore
        case 'mapping': return mappingToy;
        // @ts-ignore
        case 'popular': return popularToy;
        // @ts-ignore
        case 'recent': return recentsToy;
        // @ts-ignore
        case 'search': return searchToy;
        // @ts-ignore
        case 'source': return sourceToy;
        // @ts-ignore
        case 'view': return episodeToy;
        // @ts-ignore
        default: return
    }
}