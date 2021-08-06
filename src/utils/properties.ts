function env(name: string) {
    return process.env[name];
}

export default {
    mongo: {
        uri: env("MONGO_URI"),
    },
    jwt: {
        secret: env("JWT_SECRET_KEY")
    },
    port: env("PORT"),
    banner: {
        default: env("EVENT_IMAGE_PLACEHOLDER")
    }
}
