import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiConfig } from "../configs/aiConfig.js";

const genAI = new GoogleGenerativeAI(aiConfig.gemini.apiKey);

export const fixGrammarAI = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: aiConfig.gemini.model });

    const prompt = `
      Analyze the following text for grammar, spelling, and punctuation errors:
      "${text}"

      Return ONLY a JSON object with this exact structure:
      {
        "fixedText": "The entire text with all corrections applied",
        "matches": [
          {
            "message": "Description of the error",
            "rule": { "description": "Type of error (e.g., Spelling, Punctuation, Verb Tense)" },
            "context": {
              "text": "The original text surrounding the error",
              "offset": 0,
              "length": 5
            },
            "replacements": [{ "value": "Corrected word/phrase" }]
          }
        ]
      }
      If there are no errors, "matches" should be an empty array [].
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response
      .text()
      .replace(/```json|```/g, "")
      .trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Grammar Fix Service Error:", error);
    throw new Error("Failed to analyze grammar.");
  }
};
