import redis from "redis";
import props from "src/properties";

export let client: redis.RedisClient;

export function createRedisConnection() {
    client = redis.createClient(props.redis.uri)
    client.on("error", console.error)
    client.on("ready", () => {
        console.log("redis connection established");
    })
}