import express from "express";
import cors from "cors";

import { createRedisConnection } from "src/config/redis";
createRedisConnection();


import { createMongooseConnection } from "src/config/database"
export const connection = createMongooseConnection();


import Loader from "src/loader";
import PostController from "src/controllers/posts";
import AuthController from "src/controllers/auth";
import UsersController from "src/controllers/users";
import MediaController from "src/controllers/media";


const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static("uploads"))

const loader = new Loader(server);

loader.register(new PostController());
loader.register(new AuthController());
loader.register(new UsersController());
loader.register(new MediaController());

export default server;
