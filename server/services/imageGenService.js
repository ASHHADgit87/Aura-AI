import axios from "axios";
import { workerConfig } from "../configs/aiConfig.js";

export const generateImageAI = async (prompt) => {
  try {
    const enhancedPrompt = `Create an image that is 100% accurate, authentic, and correct. ${prompt}`;

    const response = await axios.post(
      workerConfig.url,
      { prompt: enhancedPrompt },
      {
        headers: {
          Authorization: `Bearer ${workerConfig.key}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      },
    );

    return Buffer.from(response.data).toString("base64");
  } catch (error) {
    console.error("Worker Error:", error.response?.data || error.message);
    throw new Error("Failed to communicate with AI Worker");
  }
};
