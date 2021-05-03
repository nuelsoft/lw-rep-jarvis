
function env(name: string){
    return process.env[name];
}


export default {
    smtp: {
        host: env("EMAIL_HOST"),
        user: env("EMAIL_USER"),
        pass: env("EMAIL_PASS"),
        useTLS: env("EMAIL_USE_TLS") === "1",
        port: parseInt(env("EMAIL_PORT")),
    },
    port: env("PORT")
}