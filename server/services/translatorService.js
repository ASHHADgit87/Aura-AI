import axios from "axios";
import { aiConfigTranslator } from "../configs/aiConfig.js";

export const translateTextAI = async (text, from, to) => {
  try {
    const response = await axios.post(
      aiConfigTranslator.translateAPI.url,
      {
        text: text,
        source_language: from,
        target_language: to,
      },
      {
        headers: {
          Authorization: `Bearer ${aiConfigTranslator.translateAPI.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.translated_text;
  } catch (error) {
    console.error(
      "Translation Service Error:",
      error.response?.data || error.message,
    );
    throw new Error("Failed to process translation.");
  }
};
