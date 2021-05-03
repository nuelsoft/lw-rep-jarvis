
function env(name: string){
    return process.env[name];
}


export default {
    coinbase: {
        uri: env("COINBASE_URL"),
        apiKey: env("COINBASE_API_KEY")
    },
    port: env("PORT")
}
