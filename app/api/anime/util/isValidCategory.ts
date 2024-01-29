export default function isValidCategory(str: string): str is AnimeCategory {
    const validSlug = new Set<string>(['search', 'info', 'source', 'recents', 'trending', 'popular'] as AnimeCategory[])
    return validSlug.has(str)
}