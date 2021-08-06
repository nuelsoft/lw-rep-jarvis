import express from "express";
import cors from "cors";

import Loader from "./utils/loader";

import Database from "./config/database"
import AuthController from "./controllers/auth";

Database.connect();

const server = express();

server.use(cors());
server.use(express.json());

const loader = new Loader(server);
loader.register(new AuthController())

export default server;
