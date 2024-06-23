import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("Could not connect to MongoDB", err);
  }
};

export default connectToDatabase;
