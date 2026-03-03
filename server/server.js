import express from "express";
import "dotenv/config";
import cors from "cors";

const app = express();

const port = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.TRUSTED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is Live!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
