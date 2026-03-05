import axios from "axios";
import { scraperConfig } from "../configs/aiConfig.js";

export const scrapeUrlAI = async (url, prompt) => {
  try {
    const response = await axios.get(scraperConfig.apiUrl, {
      headers: {
        Authorization: `Bearer ${scraperConfig.apiKey}`,
        "Content-Type": "application/json",
      },
      params: {
        url: url,
        output: "markdown",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Full Error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to scrape the page content.",
    );
  }
};
