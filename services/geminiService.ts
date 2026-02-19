import { GoogleGenAI } from "@google/genai";

// Initialize the API client
// Note: In a real production app, ensure your API key is secure.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'YOUR_API_KEY_HERE' });

export const improveText = async (text: string, context: string): Promise<string> => {
  if (!text) return "";

  try {
    const prompt = `
      Actúa como un asistente administrativo académico profesional.
      Mejora el siguiente texto que es parte de una sección titulada "${context}" 
      en un documento oficial para el Consejo Técnico de una universidad.
      
      Texto original: "${text}"
      
      Reglas:
      1. Mantén un tono formal, objetivo y respetuoso.
      2. Corrige ortografía y gramática.
      3. Expande la idea para que sea clara y robusta, pero concisa.
      4. Devuelve SOLAMENTE el texto mejorado, sin introducciones ni comillas.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Using the fast, efficient model
      contents: prompt,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to original text if API fails (or key is missing)
    return text;
  }
};