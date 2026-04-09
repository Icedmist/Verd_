import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
// Update your model initialization in src/lib/Gemini.ts
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_NONE",
    },
  ],
  generationConfig: { responseMimeType: "application/json" }
});
export const analyzeCrop = async (base64Image: string) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `Analyze this crop image. Identify the crop type, detect any diseases, and provide a confidence score (0-1). 
  Include a short recommendation. 
  Return ONLY JSON: { "cropName": "string", "disease": "string", "confidence": number, "recommendation": "string" }`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
  ]);
  
  return JSON.parse(result.response.text());
};
