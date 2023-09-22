/**
 * For GET requests only. (Mainly for SWR)
 */
export default function fetcher (url: string) {
    return fetch(url).then(res => res.json())
}