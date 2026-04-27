import { GoogleGenAI, Type } from "@google/genai";
import { AIRecommendation, AILiveInsight, GroundingSource } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Helper to extract sources from grounding metadata
const extractSources = (candidate: any): GroundingSource[] => {
    const chunks = candidate?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = [];
    
    chunks.forEach((chunk: any) => {
        if (chunk.web) {
            sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        } else if (chunk.maps) {
            sources.push({ title: chunk.maps.title, uri: chunk.maps.uri }); // Maps grounding usually has these
        }
    });
    return sources;
};

export const getDestinationRecommendations = async (destination: string): Promise<AIRecommendation | null> => {
  try {
    const model = "gemini-3-flash-preview"; 
    
    if (!process.env.GEMINI_API_KEY) {
        console.warn("Gemini API Key missing.");
        return null;
    }

    const prompt = `Provide travel recommendations for ${destination}. 
    Return a JSON object with the following fields:
    - destination (string)
    - description (string, max 30 words)
    - attractions (array of 3 strings)
    - food (string, one famous dish)
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                destination: { type: Type.STRING },
                description: { type: Type.STRING },
                attractions: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                },
                food: { type: Type.STRING }
            },
            required: ["destination", "description", "attractions", "food"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    let cleanText = text.trim();
    if (cleanText.startsWith("```")) {
        cleanText = cleanText.replace(/^```(?:json)?\n?/, '');
        cleanText = cleanText.replace(/\n?```$/, '');
    }
    
    return JSON.parse(cleanText) as AIRecommendation;

  } catch (error) {
    console.error("AI Service Error:", error);
    return {
        destination: destination,
        description: "A beautiful place waiting to be explored.",
        attractions: ["City Center", "Local Museum", "Historical Sites"],
        food: "Local Cuisine"
    };
  }
};

export const getRealtimeFlightInsights = async (from: string, to: string, date: string): Promise<AILiveInsight | null> => {
    try {
        if (!process.env.GEMINI_API_KEY) return null;

        const response = await ai.models.generateContent({
            model: "gemini-3.1-pro-preview",
            contents: `What are the current cheapest flight prices from ${from} to ${to} for travel on ${date}? 
            Provide a short summary of available airlines and price ranges.`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        return {
            text: response.text || "No insights available.",
            sources: extractSources(response.candidates?.[0])
        };

    } catch (error) {
        console.error("Flight Insight Error:", error);
        return null;
    }
}

export const searchHotelsWithMaps = async (city: string, date: string, guests: number): Promise<AILiveInsight | null> => {
    try {
        if (!process.env.GEMINI_API_KEY) return null;

        // Maps grounding is supported on gemini-2.5-flash
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: `Find 5 top rated hotels in ${city} suitable for ${guests} guests around ${date}.
            Provide a brief description for each including why it's a good choice.`,
            config: {
                tools: [{ googleMaps: {} }]
            }
        });

        return {
            text: response.text || "No hotels found.",
            sources: extractSources(response.candidates?.[0])
        };

    } catch (error) {
        console.error("Hotel Search Error:", error);
        return null;
    }
}
