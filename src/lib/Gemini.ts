import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Define the model once with all necessary configurations
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
  generationConfig: { 
    responseMimeType: "application/json",
    temperature: 0.4, // Slight randomness for better analysis
  }
});

export const analyzeCrop = async (base64Image: string) => {
  const prompt = `Analyze this crop image. Identify the crop type, detect any diseases, and provide a confidence score (0-1). 
  Include a short recommendation for the farmer. 
  Return ONLY JSON: { "cropName": "string", "disease": "string", "confidence": number, "recommendation": "string" }`;

  try {
    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/jpeg" } }
    ]);
    
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
