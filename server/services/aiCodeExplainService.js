import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiConfig } from "../configs/aiConfig.js";

const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);

export const explainCodeAI = async (code, language) => {
  try {
    const model = genAI.getGenerativeModel({
      model: aiConfig.gemini.model,
      systemInstruction:
        "You are an expert developer. Explain the provided code snippet clearly. Break it down into: 1. Main Purpose, 2. Logic Flow, and 3. Line-by-line breakdown if necessary.",
    });

    const prompt = `Language: ${language || "Auto-detect"}\nCode:\n${code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error("AI Explanation failed: " + error.message);
  }
};
