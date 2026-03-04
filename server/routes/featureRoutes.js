import express from "express";
import {
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
export default featureRouter;
