const mongo = require("mongoose");
const mongoUrl = require("../config.ts");

const connectMongo = async () => {
  try {
    mongo.connect("mongodb://localhost:27017/fof-test");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongo;
