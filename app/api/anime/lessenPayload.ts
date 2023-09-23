export default function lessenPayload(
    animeObj: ISearch<IAnimeResult> | IAnimeInfo | ISource | AnimeRecentsResult,
) {
    
    function filterKeys<T>(obj: T, keysToKeepArr: (keyof T)[]) {
        const keysToKeep = new Set(keysToKeepArr)
        for (const key in obj) {
            if (!keysToKeep.has(key as keyof T)) {
                delete obj[key as keyof T]
            }
        }
    }

    if (isRecent(animeObj)) return

    else if (isISearch(animeObj)) {
        animeObj.results.forEach((anime) => {
            filterKeys<IAnimeResult>(anime, ([
                'id',
                'title',
                'image',
                'cover'
            ]))
        })

        filterKeys(animeObj, ['results'])
    }

    else if (isISource(animeObj)) {
        filterKeys(animeObj, [
            'sources',
            'subtitles'
        ])
    }

    else if (isInfo(animeObj)) {
        if (animeObj.episodes) {
            animeObj.episodes.forEach((ep) => {
                filterKeys(ep, ([
                    'id',
                    'image',
                    'number',
                    'title'
                ]))
            })
        }

        filterKeys(animeObj, [
            'id',
            'title',
            'episodes',
            'cover',
            'description',
            'image',
            'status',
            'trailer',
        ])
    }
}

type lessenPayloadArgs = Parameters<typeof lessenPayload>

function isISource(animeObj: lessenPayloadArgs[0]): animeObj is ISource {
    return 'sources' in animeObj
}

function isISearch(animeObj: lessenPayloadArgs[0]): animeObj is ISearch<IAnimeResult> {
    return 'results' in animeObj && 'title' in animeObj.results[0]
}

function isInfo(animeObj: lessenPayloadArgs[0]): animeObj is IAnimeInfo {
    return 'description' in animeObj
}

function isRecent(animeObj: lessenPayloadArgs[0]): animeObj is AnimeRecentsResult {
    return 'results' in animeObj && 'episodeId' in animeObj.results[0]
}