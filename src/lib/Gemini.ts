const API_KEY = import.meta.env.VITE_XAI_API_KEY;
const API_URL = "/api/xai/v1/responses";

// Compress base64 image to reduce payload size
const compressImage = (base64: string, maxWidth = 512): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const compressed = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
      console.log(`Image compressed: ${(compressed.length / 1024).toFixed(0)}KB`);
      resolve(compressed);
    };
    img.src = `data:image/jpeg;base64,${base64}`;
  });
};

export const analyzeCrop = async (base64Image: string) => {
  if (!API_KEY) {
    throw new Error("xAI API Key is missing. Please add VITE_XAI_API_KEY to your .env.local file.");
  }

  const compressedImage = await compressImage(base64Image);

  const prompt = `Analyze this crop image. Identify the crop type, detect any diseases, and provide a confidence score (0-1). 
  Include a short recommendation for the farmer. 
  You MUST respond with ONLY valid JSON, no markdown, no explanation, just the JSON object: { "cropName": "string", "disease": "string", "confidence": number, "recommendation": "string" }`;

  try {
    console.log("Sending request to xAI /v1/responses...");

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-4.20-reasoning",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_image",
                image_url: `data:image/jpeg;base64,${compressedImage}`
              },
              {
                type: "input_text",
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const responseText = await response.text();
    console.log(`Response status: ${response.status}, body: ${responseText.substring(0, 500)}`);

    if (!response.ok) {
      let errorMsg = `API Error: ${response.status}`;
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          errorMsg = errorData?.error?.message || errorData?.error || JSON.stringify(errorData);
        } catch {
          errorMsg = responseText.substring(0, 300);
        }
      }
      throw new Error(errorMsg);
    }

    const result = JSON.parse(responseText);
    const content = result.output_text || result.output?.[0]?.content?.[0]?.text || result.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Full response:", JSON.stringify(result, null, 2));
      throw new Error("No content in API response.");
    }

    const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(cleanJson);

    console.log("✅ Analysis complete:", data);
    return {
      cropName: data.cropName || data.crop_name || data.crop || "Unknown Crop",
      disease: data.disease || data.condition || data.finding || "No Disease Detected",
      confidence: typeof data.confidence === 'number' ? data.confidence : parseFloat(data.confidence || 0),
      recommendation: data.recommendation || data.advice || data.steps || "No specific recommendation provided."
    };
  } catch (error) {
    console.error("xAI API Error:", error);
    throw error;
  }
};
