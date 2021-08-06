import express from "express";
import cors from "cors";

import Loader from "./utils/loader";

import Database from "./config/database"
import {AuthController, EventController, OfficeController, OrgController, ProjectController} from "./controllers";

Database.connect();

const server = express();

server.use(cors());
server.use(express.json());

const loader = new Loader(server);
loader.register(new AuthController());
loader.register(new OfficeController());
loader.register(new OrgController());
loader.register(new EventController());
loader.register(new ProjectController());


export default server;
