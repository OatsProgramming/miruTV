// import { Redis } from 'ioredis'

// function getRedisUrl() {
//     if (process.env.REDIS_URL) {
//         return process.env.REDIS_URL
//     }

//     throw new Error("Redis URL is undefined")
// }

// const redis = new Redis(getRedisUrl())

// // Seems to be node related...

// // Listen to 'error' events to the Redis connection
// redis.on('error', error => {
//     // @ts-ignore
//     if (error.code === 'ECONNRESET') {
//         console.log('Connection to Redis Session Store timed out');
//     // @ts-ignore
//     } else if (error.code === 'ECONNREFUSED') {
//         console.log('Connection to Redis Session Store refused');
//     } else console.log(error);
// });

// // Listen to 'reconnecting' event to Redis
// // @ts-ignore
// redis.on('reconnecting', err => {
//     if (redis.status === 'reconnecting')
//         console.log('Reconnecting to Redis Session Store...');
//     else console.log('Error reconnecting to Redis Session Store');
// });

// // Listen to the 'connect' event to Redis
// // @ts-ignore
// redis.on('connect', err => {
//     if (!err) console.log('Connected to Redis Session Store');
// });

import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default redis