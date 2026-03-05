import { generateImageAI } from "../services/imageGenService.js";
import { generatePdfSummaryAI } from "../services/pdfSummaryService.js";
import { analyzeImageAI } from "../services/imageAnalysisService.js";
import { explainCodeAI } from "../services/aiCodeExplainService.js";
import { removeImageBackgroundAI } from "../services/bgRemovalService.js";
import { translateTextAI } from "../services/translatorService.js";
import { fixGrammarAI } from "../services/GrammerFixService.js";
import { scrapeUrlAI } from "../services/webScrapeService.js";
import { aiConfig } from "../configs/aiConfig.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);
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
export const removeBackgroundController = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const processedBuffer = await removeImageBackgroundAI(req.file.buffer);

    if (processedBuffer[0] === 0x89 && processedBuffer[1] === 0x50) {
      const base64Image = processedBuffer.toString("base64");
      return res.status(200).json({
        success: true,
        image: `data:image/png;base64,${base64Image}`,
      });
    } else {
      console.error(
        "Unexpected buffer content:",
        processedBuffer.toString().slice(0, 100),
      );
      return res
        .status(500)
        .json({ success: false, message: "Invalid image format received." });
    }
  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const translateText = async (req, res) => {
  try {
    const { text, from, to } = req.body;

    if (!text || !to) {
      return res.status(400).json({
        success: false,
        message: "Text and target language are required.",
      });
    }

    const translatedText = await translateTextAI(text, from, to);

    res.status(200).json({
      success: true,
      translatedText,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const fixGrammar = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res
        .status(400)
        .json({ success: false, message: "Text is required" });
    }

    const data = await fixGrammarAI(text);

    res.status(200).json({
      success: true,
      fixedText: data.fixedText,
      matches: data.matches,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const webScraper = async (req, res) => {
  try {
    const { url, prompt } = req.body;
    if (!url)
      return res
        .status(400)
        .json({ success: false, message: "URL is required" });

    const rawData = await scrapeUrlAI(url, prompt);

    const model = genAI.getGenerativeModel({ model: aiConfig.gemini.model });
    const aiPrompt = `
      Extract information from this scraped content from ${url}.
      User Request: ${prompt || "Extract all key information"}
      
      Return ONLY a valid JSON object. Do not include markdown formatting or explanations.
      
      Content:
      ${typeof rawData === "string" ? rawData : JSON.stringify(rawData)}
    `;

    const result = await model.generateContent(aiPrompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();

    res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("Web Scraper Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
