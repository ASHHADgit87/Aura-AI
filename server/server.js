import express from "express";

import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./configs/db.js";
import featureRouter from "./routes/featureRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const corsOptions = {
  origin: process.env.TRUSTED_ORIGINS?.split(",") ,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/features", featureRouter);

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
