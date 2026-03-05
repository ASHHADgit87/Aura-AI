import axios from "axios";
import { briaConfig } from "../configs/aiConfig.js";
import FormData from "form-data";

export const removeImageBackgroundAI = async (imageBuffer) => {
  try {
    const form = new FormData();
    form.append("file", imageBuffer, {
      filename: "image.png",
      contentType: "image/png",
    });

    const response = await axios.post(
      "https://engine.prod.bria-api.com/v1/background/remove",
      form,
      {
        headers: {
          ...form.getHeaders(),
          api_token: briaConfig.apiKey,
        },
        responseType: "arraybuffer",
      },
    );

    const dataString = Buffer.from(response.data).toString();

    try {
      const jsonResponse = JSON.parse(dataString);

      if (jsonResponse.result_url) {
        console.log("Downloading result from Bria URL...");
        const imageResponse = await axios.get(jsonResponse.result_url, {
          responseType: "arraybuffer",
        });
        return Buffer.from(imageResponse.data);
      }
    } catch (e) {
      return Buffer.from(response.data);
    }

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Bria API Error:", error.message);
    throw new Error("Background removal failed. Please try again.");
  }
};
