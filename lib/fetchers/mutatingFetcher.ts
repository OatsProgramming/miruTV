/**
 * Handles 'mutating' HTTP methods. 
 * Returns result (useful for updating client side data (SWR)).
 * @param method 
 * @param data 
 * @returns 
 */

export default async function mutatingFetcher(url: string, method: Exclude<Method, 'GET'>, data: { [key: string]: any }) {
    const res = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'applications/json'
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        const result = await res.text()
        console.error(result)
        return 
    }
    const result = await res.json()
    return { data: result }
}