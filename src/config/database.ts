import mongoose from "mongoose";
import props from "src/properties";

export function createMongooseConnection() {
  mongoose.connect(props.mongo.uri, {
    useNewUrlParser: true,
    autoIndex: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  const { connection } = mongoose;

  connection.on("error", console.error.bind(console, "connection error:"));
  connection.once("open", function () {
    console.log("database connection established successfully");
  });

  return connection;
}
