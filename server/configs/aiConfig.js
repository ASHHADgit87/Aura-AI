import dotenv from "dotenv";
dotenv.config();

export const workerConfig = {
  url: process.env.IMAGE_GEN_WORKER_URL,
  key: process.env.IMAGE_GEN_WORKER_KEY,
};

export const hfConfig = {
  token: process.env.HF_TOKEN,

  summaryModel: "meta-llama/Llama-3.1-8B-Instruct",
};
export const aiConfig = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash",
  },
};
export const briaConfig = {
  apiKey: process.env.BRIA_BG_API_KEY,
};
export const aiConfigTranslator = {
  gemini: {
    apiKey: process.env.TRANSLATOR_KEY,
    model: "gemini-2.5-flash",
  },
};
export const scraperConfig = {
  apiKey: process.env.WEB_SCRAPER_API_KEY,
  apiUrl: "https://api.webscraperapi.ai/v2/scrape",
};
