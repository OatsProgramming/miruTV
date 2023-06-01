'use client'

export default function FavId() {
    async function handleClick(action: 'PATCH' | 'DELETE') {
        try {
            const res = await fetch('/api/favId', {
                method: action,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: "123"
            })

            if (!res.ok) {
                const result = await res.text()
                console.error(result)
                return
            }
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <button onClick={() => handleClick('PATCH')}>
                Add id
            </button>
            <button onClick={() => handleClick('DELETE')}>
                Remove id
            </button>
        </div>
    )
}