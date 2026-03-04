import { generateImageAI } from "../services/imageGenService.js";
import { generatePdfSummaryAI } from "../services/pdfSummaryService.js";

export const imageGenerator = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }
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
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No PDF file uploaded" });
    }

    const { prompt } = req.body;
    const summary = await generatePdfSummaryAI(req.file.buffer, prompt);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
