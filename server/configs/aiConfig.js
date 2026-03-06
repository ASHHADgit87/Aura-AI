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

  codeAI: {
    apiKey: process.env.OPENROUTER_API_KEY,
    apiUrl: "https://openrouter.ai/api/v1/chat/completions",
    model: "deepseek/deepseek-chat",
  },
};
export const briaConfig = {
  apiKey: process.env.BRIA_BG_API_KEY,
};

export const aiConfigTranslator = {
  translateAPI: {
    url: process.env.TRANSLATEAPI_URL,
    apiKey: process.env.TRANSLATEAPI_KEY,
  },
};
export const scraperConfig = {
  apiKey: process.env.WEB_SCRAPER_API_KEY,
  apiUrl: "https://api.webscraperapi.ai/v2/scrape",
};
