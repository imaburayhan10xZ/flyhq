import { AIRecommendation, AILiveInsight, GroundingSource } from "../types";

const OPENROUTER_API_KEY = "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";

async function fetchFromOpenRouter(model: string, prompt: string) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }]
        })
    });
    if (!res.ok) {
        throw new Error(`OpenRouter API Error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
}

export const getDestinationRecommendations = async (destination: string): Promise<AIRecommendation | null> => {
  try {
    const model = "google/gemini-2.0-flash-lite-preview-02-05:free"; 
    
    const prompt = `Provide travel recommendations for ${destination}. 
    Return a JSON object with the following fields and ONLY these fields (no markdown wrap):
    - destination (string)
    - description (string, max 30 words)
    - attractions (array of 3 strings)
    - food (string, one famous dish)
    `;

    const data = await fetchFromOpenRouter(model, prompt);
    const text = data.choices[0]?.message?.content;
    if (!text) return null;
    
    let cleanText = text.trim();
    if (cleanText.startsWith("\`\`\`")) {
        cleanText = cleanText.replace(/^\`\`\`(?:json)?\n?/, '');
        cleanText = cleanText.replace(/\n?\`\`\`$/, '');
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
        const response = await fetchFromOpenRouter(
            "google/gemini-2.0-flash-lite-preview-02-05:free",
            `What are the current cheapest flight prices from ${from} to ${to} for travel on ${date}? Provide a short summary of available airlines and price ranges.`
        );

        return {
            text: response.choices[0]?.message?.content || "No insights available.",
            sources: []
        };

    } catch (error) {
        console.error("Flight Insight Error:", error);
        return null;
    }
}

export const searchHotelsWithMaps = async (city: string, date: string, guests: number): Promise<AILiveInsight | null> => {
    try {
        const response = await fetchFromOpenRouter(
            "google/gemini-2.0-flash-lite-preview-02-05:free",
            `Find 5 top rated hotels in ${city} suitable for ${guests} guests around ${date}. Provide a brief description for each including why it's a good choice.`
        );

        return {
            text: response.choices[0]?.message?.content || "No hotels found.",
            sources: []
        };

    } catch (error) {
        console.error("Hotel Search Error:", error);
        return null;
    }
}
