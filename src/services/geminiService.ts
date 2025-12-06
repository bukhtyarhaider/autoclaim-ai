import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AssessmentResult, DamageType, Severity } from "../types";
import { ANALYSIS_PROMPT } from "./prompts";

const processImage = async (base64Image: string): Promise<AssessmentResult> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key not found. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Remove data:image/png;base64, prefix if present
  const base64Data = base64Image.split(',')[1] || base64Image;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      vehicleType: { type: Type.STRING, description: "Specific Vehicle Make, Model, and approximate Year (e.g., '2018 Toyota Corolla', '2022 BMW X5')" },
      damages: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "Unique identifier for the damage" },
            type: { 
              type: Type.STRING, 
              enum: [
                'Dent', 'Scratch', 'Crack', 'Broken Glass', 'Paint Damage', 'Missing Part', 'Other'
              ]
            },
            severity: { 
              type: Type.STRING, 
              enum: ['Low', 'Medium', 'High', 'Critical']
            },
            description: { type: Type.STRING, description: "Short description of the damage" },
            estimatedCost: { type: Type.NUMBER, description: "Estimated repair cost in PKR (Pakistani Rupee)" },
            box_2d: {
              type: Type.ARRAY,
              description: "Bounding box coordinates [ymin, xmin, ymax, xmax] on a 0-1000 scale.",
              items: { type: Type.NUMBER }
            }
          },
          required: ["id", "type", "severity", "description", "estimatedCost", "box_2d"]
        }
      },
      totalEstimatedCost: { type: Type.NUMBER, description: "Sum of all estimated costs" },
      summary: { type: Type.STRING, description: "Professional executive summary including vehicle identification and damage overview." },
      confidenceScore: { type: Type.NUMBER, description: "Confidence score of the assessment between 0 and 1" }
    },
    required: ["vehicleType", "damages", "totalEstimatedCost", "summary", "confidenceScore"]
  };

  try {
      const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: ANALYSIS_PROMPT
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Very low temperature for precise, grounded facts
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from AI model");
    }

    const parsedData = JSON.parse(resultText);

    return {
      ...parsedData,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

export const geminiService = {
  processImage
};