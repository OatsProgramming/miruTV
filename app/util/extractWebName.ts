export default function extractDomainName(url: string) {
    const pattern = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)\./;

    const match = url.match(pattern);
    if (match) {
        const name = match[1]
        // Just uppercase the first letter
        const result = name.replace(match[1][0], match[1][0].toUpperCase())
        return result
    }
    else return
}