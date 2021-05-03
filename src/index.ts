require("dotenv").config();
require('module-alias/register');

import server from "./server";
import http from "http";

const { PORT = 3000 } = process.env;


http.createServer(server).listen(PORT, () => {
  console.log(`Social media API started on port ${PORT} 🍻`);
});
