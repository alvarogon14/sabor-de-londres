import { GoogleGenAI } from "@google/genai";
import { GroundingMetadata, RestaurantLocation } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

interface ServiceResponse {
  text: string;
  groundingMetadata: GroundingMetadata | null;
  locations: RestaurantLocation[];
}

export const searchRestaurants = async (userQuery: string, userLocation?: GeolocationCoordinates): Promise<ServiceResponse> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let contents = `You are a local expert on authentic Spanish cuisine in London. Your goal is to help users find the best spots, from hidden gems like Garcia Delicatessen on Portobello Road to high-end experiences like Arròs QD.`;
    
    if (userQuery) {
      contents += `\n\nUser Query: "${userQuery}".`;
      contents += `\nProvide detailed recommendations matching this request. Prioritize authenticity and quality. If the user asks for generic terms, suggest specific famous places.`;
    } else {
      contents += `\n\nShow me a mix of popular tapas bars, authentic fine dining, and Spanish delis/bakeries in London.`;
    }

    contents += `\nPlease provide a helpful guide describing these places with enthusiasm. Write in natural language markdown.`;
    
    contents += `\n\nIMPORTANT: At the very end of your response, strictly output a JSON code block containing the list of recommended places with their coordinates. 
    The JSON must follow this array format exactly:
    \`\`\`json
    [
      {
        "name": "Exact Name of Place",
        "lat": 51.5074,
        "lng": -0.1278,
        "description": "A brief 5-10 word summary",
        "category": "restaurant" | "bakery" | "pub"
      }
    ]
    \`\`\`
    Ensure the coordinates (lat/lng) are accurate for London locations. Do not include this JSON block in the natural language part, put it at the absolute end.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    // If we have location, hint it to the model
    if (userLocation) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.latitude,
            longitude: userLocation.longitude
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config
    });

    let text = response.text || "No details found.";
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata as GroundingMetadata | undefined;
    
    // Parse the JSON block for locations
    let locations: RestaurantLocation[] = [];
    // Robust regex to catch JSON block even if spacing varies
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsedData = JSON.parse(jsonMatch[1]);
        if (Array.isArray(parsedData)) {
            locations = parsedData.map((item: any, index: number) => ({
            id: `search-result-${index}`,
            name: item.name,
            lat: item.lat,
            lng: item.lng,
            description: item.description,
            category: item.category || 'restaurant',
            rating: 4.5 
            }));
        }
        
        // Remove the JSON block from the display text so it doesn't show in the UI
        text = text.replace(jsonMatch[0], '').trim();
      } catch (e) {
        console.error("Failed to parse location JSON from model response", e);
      }
    }

    return {
      text,
      groundingMetadata: groundingMetadata || null,
      locations
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to fetch restaurant recommendations.");
  }
};