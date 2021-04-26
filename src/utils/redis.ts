import { promisify } from "util";
import {client} from "src/config/redis";

export default {
    get: promisify(client.get).bind(client),
    set: promisify(client.set).bind(client),
    setex: promisify(client.setex).bind(client),
    del: promisify(client.del).bind(client),
}