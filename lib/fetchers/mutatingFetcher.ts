type SuccessRes<T> = {
    data: T & {
        method: Exclude<Method, 'GET'>
    }
}

/**
 * Handles 'mutating' HTTP methods. 
 * Returns result (useful for updating client side data (SWR)).
 * (Using ^13.4: adding method to body)
 * @param method 
 * @param data 
 * @returns 
 */

export default async function mutatingFetcher<T>(url: string, method: Exclude<Method, 'GET'>, data: T) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'applications/json'
        },
        body: JSON.stringify({ method, data })
    })
    if (!res.ok) {
        const result = await res.text()
        console.error(result)
        return { message: result }
    }
    const result = await res.json()
    return { data: result } as SuccessRes<T>
}