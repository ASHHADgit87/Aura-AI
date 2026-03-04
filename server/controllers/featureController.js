import { generateImageAI } from "../services/imageGenService.js";

export const imageGenerator = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, message: "Prompt is required" });
    }

    const base64Data = await generateImageAI(prompt);

    if (!base64Data) {
      throw new Error("No data received from AI service");
    }

    res.json({
      success: true,
      image: `data:image/png;base64,${base64Data.trim()}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
