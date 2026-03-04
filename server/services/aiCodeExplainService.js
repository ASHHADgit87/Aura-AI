import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiConfig } from "../configs/aiConfig.js";

const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);

export const explainCodeAI = async (code, language) => {
  try {
    const model = genAI.getGenerativeModel({
      model: aiConfig.gemini.model,
      systemInstruction: `You are an expert developer. Format your response using clean Markdown:
        - Use ### for Section Headers.
        - Use **bold** for key terms and variable names.
        - Use code blocks for any code examples.
        - Use bullet points for logic steps.
        - Keep the tone professional, concise, and user-friendly.
        - Avoid long, dense paragraphs.
        - Be Concise but not too much concise.`,
    });

    const prompt = `Language: ${language || "Auto-detect"}\nCode:\n${code}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error("AI Explanation failed: " + error.message);
  }
};
