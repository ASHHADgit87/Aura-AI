import express from "express";
import "dotenv/config";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./configs/db.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const corsOptions = {
  origin: process.env.TRUSTED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
