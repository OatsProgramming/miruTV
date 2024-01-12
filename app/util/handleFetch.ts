export async function handleFetch(url: string) {
    const res = await fetch(url)
    if (!res.ok) {
        const result = await res.text()
        console.log(result)
        return new Response(result, { status: 500 })
    }
    const result = await res.json()
    return new Response(JSON.stringify(result, undefined, 2), { status: 200 })
}