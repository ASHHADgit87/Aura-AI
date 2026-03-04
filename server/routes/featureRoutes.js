import express from "express";
import { imageGenerator } from "../controllers/featureController.js";
import { protect } from "../middlewares/authMiddleware.js";

const featureRouter = express.Router();

featureRouter.post("/image-generator", protect, imageGenerator);

export default featureRouter;
