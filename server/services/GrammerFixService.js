import axios from "axios";
import { aiConfig } from "../configs/aiConfig.js";

export const fixGrammarAI = async (text) => {
  try {
    const systemInstruction = `
You are a grammar expert.

Analyze the following text for grammar, spelling, and punctuation errors.
Return ONLY valid JSON with the EXACT structure:

{
  "fixedText": "The corrected full text",
  "matches": [
    {
      "message": "Description of the error",
      "rule": {
        "description": "Type of error"
      },
      "context": {
        "text": "Original context text",
        "offset": 0,
        "length": 0
      },
      "replacements": [
        { "value": "Corrected text" }
      ]
    }
  ]
}
No extra text. No explanation outside JSON.
`;

    const userPrompt = `
Text to fix: """${text}"""
`;

    const response = await axios.post(
      aiConfig.grammarAI.apiUrl,
      {
        model: aiConfig.grammarAI.model,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.1,
        max_tokens: 1500,
      },
      {
        headers: {
          Authorization: `Bearer ${aiConfig.grammarAI.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    const jsonText = response.data.choices[0].message.content
      .replace(/```json|```/g, "")
      .trim();

    return JSON.parse(jsonText);
  } catch (error) {
    console.error(
      "Grammar Fix Service Error:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to analyze grammar.");
  }
};
