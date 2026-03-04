import express from "express";
import {
  analyzeImage,
  imageGenerator,
  summarizePdf,
} from "../controllers/featureController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const featureRouter = express.Router();

featureRouter.post("/image-generator", protect, imageGenerator);
featureRouter.post(
  "/pdf-summarizer",
  protect,
  upload.single("pdf"),
  summarizePdf,
);
featureRouter.post(
  "/image-analyzer",
  protect,
  upload.single("image"),
  analyzeImage,
);

export default featureRouter;
