import mongoose from "mongoose";
import props from "../utils/properties";
import Logger from "../utils/logger";

export default class {
    static async connect(): Promise<mongoose.Connection> {
        const db =
            await mongoose.connect(props.mongo.uri, {
                useNewUrlParser: true,
                autoIndex: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });


        db.connection.on("error", console.error.bind(console, "connection error:"));
        db.connection.once("open", function () {
            Logger.speak("no capping! database connected 🍷");
        });

        return db.connection;
    }
}

