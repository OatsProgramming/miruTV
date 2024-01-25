/**
 * For GET requests only. (Mainly for SWR)
 */
export default function fetcher (url: string) {
    return fetch(url, { next: { revalidate: 0 }}).then(res => res.json())
}