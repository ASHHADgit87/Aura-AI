import axios from "axios";
import { aiConfig } from "../configs/aiConfig.js";

export const explainCodeAI = async (code, language) => {
  try {
    const systemPrompt = `
You are an expert software engineer.

Your job:
1. Detect the programming language of the code.
2. Explain the code clearly.

Always format the output in clean Markdown using this structure:

### Language
Write the detected programming language.

### Overview
Explain briefly what the code does.

### Key Components
- Use bullet points
- Highlight important variables and functions using **bold**

### Step-by-Step Logic
Explain the program flow step by step using bullet points.

### Code Example (if useful)
Provide a small example if helpful.

Rules:
- Always detect the language if not provided
- Use ### headings
- Use bullet points
- Use **bold** for important terms
- Avoid long paragraphs
- Keep explanation clear and professional
`;

    const response = await axios.post(
      aiConfig.codeAI.apiUrl,
      {
        model: aiConfig.codeAI.model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: `Language (if known): ${language || "Auto detect"}

Explain the following code:

${code}`,
          },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${aiConfig.codeAI.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error("AI Explanation failed: " + error.message);
  }
};
