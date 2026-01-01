
import { GoogleGenAI, Type } from "@google/genai";
import { FestiveMessage } from "../types";

export const fetchFestiveMessage = async (): Promise<FestiveMessage> => {
  // Always initialize with the direct process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate a truly inspiring, festive, and hopeful quote for the New Year. It should feel grand and celebratory.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { 
              type: Type.STRING, 
              description: "A high-impact inspirational quote for the New Year." 
            },
            author: { 
              type: Type.STRING, 
              description: "A name of a famous person or 'A Midnight Voice'." 
            }
          },
          required: ["quote", "author"]
        }
      }
    });

    const text = response.text || '';
    const result = JSON.parse(text);
    return result as FestiveMessage;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      quote: "The best time for a new beginning is now. Cheers to your future!",
      author: "Tradition"
    };
  }
};
