export default async function getSource(sourceId: string): Promise<EnimeSourceHSL | undefined> {
    try {
        const res = await fetch(`http://localhost:3000/api/enime/source?sourceId=${sourceId}`)

        if (!res.ok) {
            const result = await res.text()
            console.error(result)
        }

        return res.json()
    } catch (err) {
        console.error(err)
    }
}
