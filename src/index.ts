require("dotenv").config();
import server from "./server";
import http from "http";

const {PORT = 3000} = process.env;

http.createServer(server).listen(PORT, () => {
    console.log(`LW REP ready to brew at :${PORT} 🍻`);
});
