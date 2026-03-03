import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("MongoDB Connected to Aura-AI"),
    );
    mongoose.connection.on("error", (err) => console.log("DB Error:", err));

    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      dbName: "Aura-AI",
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

export default connectDB;
