const mongo = require("mongoose");

const connectMongo = async (): Promise<void> => {
  try {
    mongo.connect(process.env.MONGO_CONNECT_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectMongo;
