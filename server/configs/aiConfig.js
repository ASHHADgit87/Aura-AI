import dotenv from "dotenv";
dotenv.config();

export const workerConfig = {
  url: process.env.IMAGE_GEN_WORKER_URL,
  key: process.env.IMAGE_GEN_WORKER_KEY,
};

export const hfConfig = {
  token: process.env.HF_TOKEN,
  summaryModel: "meta-llama/Llama-3.2-3B-Instruct",
};

export const aiConfig = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash",
  },
};
