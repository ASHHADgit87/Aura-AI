import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from "sharp";
import { aiConfig } from "../configs/aiConfig.js";

const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);

export const analyzeImageAI = async (fileBuffer, mimeType, userPrompt = "") => {
  try {
    const compressedBuffer = await sharp(fileBuffer)
      .resize(1024)
      .jpeg({ quality: 80 })
      .toBuffer();

    const base64Image = compressedBuffer.toString("base64");

    const model = genAI.getGenerativeModel({
      model: aiConfig.gemini.model,
      systemInstruction:
        "You are an image analyzer. Provide direct, concise answers. Avoid poetic language, long introductions, or 'Overall' summaries. Use plain text or simple formatting only.But Dont be too small like normal answer length if user aks somehtign that needs big length so you can give big length.analysis must not be less than 3 lines.",
    });

    const strictPrompt = userPrompt
      ? `Analyze this image and answer this specifically: ${userPrompt}. Be direct.`
      : "Identify the main objects and colors in this image. List them clearly and briefly.";

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([strictPrompt, imagePart]);
    const response = await result.response;

    return response.text().trim();
  } catch (error) {
    console.error("Gemini Vision Error:", error.message);
    throw new Error("AI analysis failed. Please try a different image.");
  }
};
