import pdf from "pdf-parse-new";
import axios from "axios";
import { hfConfig } from "../configs/aiConfig.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chunkText = (text, chunkSize = 3000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

const callHF = async (messages, maxTokens = 900) => {
  const response = await axios.post(
    "https://router.huggingface.co/v1/chat/completions",
    {
      model: hfConfig.summaryModel,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
      top_p: 0.9,
    },
    {
      headers: {
        Authorization: `Bearer ${hfConfig.token}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.choices[0]?.message?.content;
};

export const generatePdfSummaryAI = async (
  fileBuffer,
  userPrompt = "",
  retries = 3,
) => {
  try {
    const data = await pdf(fileBuffer);
    const rawText = data.text?.trim();

    if (!rawText) {
      throw new Error("PDF appears to be empty or image-based.");
    }

    const cleanText = rawText.replace(/\s+/g, " ").trim();

    const chunks = chunkText(cleanText, 3000);

    let sectionSummaries = [];

    for (let i = 0; i < chunks.length; i++) {
      const prompt = `
You are an expert document summarizer.

Summarize the following section in structured format:

Rules:
- Use clear section headings starting with ### 
- Use bullet points using *
- Keep it easy to read
- Highlight important terms using **bold**
- Do NOT write long paragraphs

Section Content:
${chunks[i]}
`;

      const summary = await callHF(
        [
          { role: "system", content: "You format summaries professionally." },
          { role: "user", content: prompt },
        ],
        900,
      );

      if (!summary) {
        throw new Error("AI returned empty summary.");
      }

      sectionSummaries.push(summary.trim());
    }

    const combinedSections = sectionSummaries.join("\n");

    const finalPrompt = `
Below are structured summaries of document sections.

Combine them into ONE clean, well-structured summary.
Rules:
- Keep ALL sections from the document
- Do NOT remove any section even if small
- Preserve FAQ, checklist, quick reference, and conclusion
- Maintain heading structure
- Use ### headings
- Use bullet points
${userPrompt ? `- Follow this additional instruction: ${userPrompt}` : ""}

Content:
${combinedSections}
`;

    const finalSummary = await callHF(
      [
        {
          role: "system",
          content: "You are a professional document summarizer.",
        },
        { role: "user", content: finalPrompt },
      ],
      1200,
    );

    if (!finalSummary) {
      throw new Error("Final summary generation failed.");
    }

    return finalSummary.trim();
  } catch (error) {
    const hfError = error.response?.data?.error || error.message;
    console.error("HF Error:", hfError);

    if (error.response?.status === 503 && retries > 0) {
      await sleep(8000);
      return generatePdfSummaryAI(fileBuffer, userPrompt, retries - 1);
    }

    throw new Error(
      hfError?.message || hfError || "Failed to connect to AI Router",
    );
  }
};
