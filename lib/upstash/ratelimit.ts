import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import redis from "../redis";

export default async function ratelimit(ip: string | undefined | null) {
    // Create a new ratelimiter, that allows 10 requests per 60 seconds
const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "60 s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: "@upstash/ratelimit",
  });
  
  // Use a constant string to limit all requests with a single ratelimit
  // Or use a userID, apiKey or ip address for individual limits.
  const id = ip || 'anon';
  const { success } = await ratelimit.limit(id)
  
  if (!success) {
    return new Response("Rate limit reached", { status: 429 })
  }

  return
}