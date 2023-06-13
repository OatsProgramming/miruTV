import { Redis } from 'ioredis'

function getRedisUrl() {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL
    }

    throw new Error("Redis URL is undefined")
}

const redis = new Redis(getRedisUrl())

export default redis