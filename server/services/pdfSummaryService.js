import pdf from "pdf-parse-new";
import axios from "axios";
import { hfConfig } from "../configs/aiConfig.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const generatePdfSummaryAI = async (
  fileBuffer,
  userPrompt = "",
  retries = 3,
) => {
  try {
    const data = await pdf(fileBuffer);
    const textToSummarize = data.text?.trim();

    if (!textToSummarize) {
      throw new Error("PDF appears to be empty or an image-only scan.");
    }

    const cleanText = textToSummarize.replace(/\s+/g, " ").substring(0, 4000);

    const systemPrompt =
      "You are a helpful assistant that summarizes documents.";
    const userMessage = userPrompt
      ? `Task: ${userPrompt}\n\nDocument: ${cleanText}`
      : `Please provide a detailed summary of the following document:\n\n${cleanText}`;
    const response = await axios.post(
      `https://router.huggingface.co/v1/chat/completions`,
      {
        model: hfConfig.summaryModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${hfConfig.token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const summary = response.data.choices[0]?.message?.content;

    if (!summary) {
      throw new Error("AI returned an empty response.");
    }

    return summary.trim();
  } catch (error) {
    const hfError = error.response?.data?.error || error.message;
    console.error("Detailed HF Error:", hfError);

    if (error.response?.status === 503 && retries > 0) {
      console.log(`Model is waking up... retrying in 8s (${retries} left)`);
      await sleep(8000);
      return generatePdfSummaryAI(fileBuffer, userPrompt, retries - 1);
    }

    throw new Error(
      hfError?.message || hfError || "Failed to connect to AI Router",
    );
  }
};
