import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AssessmentResult, DamageType, Severity } from "../types";

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
            estimatedCost: { type: Type.NUMBER, description: "Estimated repair cost in USD based on specific vehicle model parts and labor" },
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
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          {
            text: `Act as a Senior Automotive Insurance Adjuster and Appraiser.

            Analyze the provided image to create a highly accurate damage assessment report.

            **STEP 1: VEHICLE IDENTIFICATION (CRITICAL)**
            * Identify the **Make, Model, and Generation** of the vehicle (e.g., "Honda Civic 10th Gen", "Toyota Fortuner", "Suzuki Alto").
            * **Assess the Vehicle Class**: Is it Economy, Mid-Range, or Luxury?
            * **Adjust Pricing accordingly**: 
              - *Economy (e.g., Suzuki, Toyota, Honda)*: Lower parts/labor costs.
              - *Luxury (e.g., BMW, Audi, Mercedes)*: Higher parts/labor costs.

            **STEP 2: DAMAGE ANALYSIS & PRICING**
            * Identify all visible damages.
            * Estimate repair costs (Parts + Labor + Paint) in **USD**.
            * **BE REALISTIC. DO NOT OVERESTIMATE.** Use current market rates for parts.
            
            **Pricing Reference (USD)**:
            * **Minor Scratches/Dents (Paint/Buffing)**:
              - Economy: $100 - $300
              - Luxury: $300 - $600
            * **Panel Repair (Denting + Painting)**:
              - Economy: $200 - $500 per panel
              - Luxury: $500 - $1,200 per panel
            * **Component Replacement (Bumper, Headlight, Mirror)**:
              - Use specific part costs. (e.g., A Corolla bumper is ~$150-$300, a BMW bumper is ~$1000+).
              - Add painting/fitting labor (~$200-$500).

            **STEP 3: OUTPUT**
            * Provide the "vehicleType" as the specific Make/Model identified.
            * Return the data adhering strictly to the JSON schema.
            * Ensure "totalEstimatedCost" is the accurate sum of individual costs.
            `
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