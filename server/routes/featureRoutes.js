import express from "express";
import {
  analyzeImage,
  imageGenerator,
  summarizePdf,
  explainCode,
  removeBackgroundController,
  translateText,
  fixGrammar,
  webScraper,
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

featureRouter.post("/code-explainer", protect, explainCode);
featureRouter.post(
  "/remove-bg",
  protect,
  upload.single("image"),
  removeBackgroundController,
);
featureRouter.post("/translate", protect, translateText);
featureRouter.post("/grammer-fix", protect, fixGrammar);
featureRouter.post("/web-scrape", protect, webScraper);
export default featureRouter;
