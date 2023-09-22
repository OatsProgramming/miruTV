export default function handleError(error: unknown) {
    const err = error as Error
    console.error(err)
    return new Response(err.message, { status: 500 })
}