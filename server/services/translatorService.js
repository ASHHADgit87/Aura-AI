import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiConfigTranslator } from "../configs/aiConfig.js";

const genAI = new GoogleGenerativeAI(aiConfigTranslator.gemini.apiKey);

export const translateTextAI = async (text, from, to) => {
  try {
    const model = genAI.getGenerativeModel({
      model: aiConfigTranslator.gemini.model,
    });

    const prompt = `Translate the following text from ${from} to ${to}. 
    Provide only the translated text. Do not include explanations or conversational filler.
    Text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Translation Service Error:", error);
    throw new Error("Failed to process translation.");
  }
};
