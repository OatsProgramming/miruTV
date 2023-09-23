export default function getTitleXEpNumber(str: string) {
    const title = str
        .split('-')
        .map(word => word
            .charAt(0)
            .toUpperCase()
            + word.substring(1)
        )

    const episode = title
        .splice(-2, 2)
        .at(-1)

    return { title: title.join(' '), episode }
}
