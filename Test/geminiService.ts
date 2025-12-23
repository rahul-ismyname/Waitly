
import { GoogleGenAI, Type } from "@google/genai";
import { Place } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCrowdAdvice(places: Place[]) {
  const prompt = `
    Based on the following real-time crowd data for locations in Delhi, 
    provide 3 concise, actionable pieces of advice for users trying to save time.
    Locations: ${places.map(p => `${p.name} (${p.type}): Crowd=${p.crowdLevel}, Avg Wait=${p.counters[0]?.waitTime}m`).join(', ')}
    Format the response as a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [
      "Avoid SBI Bank right now; Loan Desk wait times are reaching peak levels.",
      "Apollo Clinic's Pharmacy is unusually fast today—good time for prescription pickups.",
      "Central Library remains the quietest spot nearby for productive work."
    ];
  }
}
