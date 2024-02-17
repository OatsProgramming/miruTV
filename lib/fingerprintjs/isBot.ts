import { load } from "@fingerprintjs/botd";

export default async function isBot() {
    // Initialize an agent at application startup, once per page/app.
    const botDetection = await load()
    // Get detection results when you need them.
    const result = botDetection.detect()
    return result.bot
}
