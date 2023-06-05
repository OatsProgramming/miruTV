'use client'

export default function FavId() {
    async function handleClick(action: 'POST' | 'DELETE') {
        try {
            const res = await fetch('/api/favId', {
                method: action,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    favId: '123'
                })
            })

            if (!res.ok) {
                const result = await res.text()
                console.log(result)
                return
            }
            const result = await res.json()
            console.log(result)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <button onClick={() => handleClick('POST')}>
                Add id
            </button>
            <button onClick={() => handleClick('DELETE')}>
                Remove id
            </button>
        </div>
    )
}