import { generateImageAI } from "../services/imageGenService.js";
import { generatePdfSummaryAI } from "../services/pdfSummaryService.js";
import { analyzeImageAI } from "../services/imageAnalysisService.js";
import { explainCodeAI } from "../services/aiCodeExplainService.js";

export const imageGenerator = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt)
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    const base64Data = await generateImageAI(prompt);
    res.json({
      success: true,
      image: `data:image/png;base64,${base64Data.trim()}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const summarizePdf = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No PDF file uploaded" });
    const { prompt } = req.body;
    const summary = await generatePdfSummaryAI(req.file.buffer, prompt);
    res.json({ success: true, summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeImage = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded." });
    if (req.file.size > 5 * 1024 * 1024)
      return res
        .status(400)
        .json({ success: false, message: "Image must be under 5MB." });
    const { prompt } = req.body;
    const output = await analyzeImageAI(
      req.file.buffer,
      req.file.mimetype,
      prompt,
    );
    res.status(200).json({ success: true, output });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const explainCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code)
      return res
        .status(400)
        .json({ success: false, message: "Code snippet is required" });

    const explanation = await explainCodeAI(code, language);
    res.status(200).json({ success: true, explanation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
