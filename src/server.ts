import express from "express";
import cors from "cors";

import Loader from "src/loader";
import EventsController from "src/controllers/events.controller";


const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static("uploads"))

const loader = new Loader(server);

loader.register(new EventsController());

export default server;
