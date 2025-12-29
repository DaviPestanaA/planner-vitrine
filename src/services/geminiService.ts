
import { GoogleGenAI } from "@google/genai";

export const generateCaption = async (title: string, type: string, pilar: string, niche: string, tone: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Você é um social media sênior. Crie uma legenda para Instagram para o seguinte post:
    - Título: ${title}
    - Formato: ${type}
    - Pilar de conteúdo: ${pilar}
    - Nicho do Cliente: ${niche}
    - Tom de voz: ${tone}

    Regras:
    1. Seja criativo e use emojis moderadamente.
    2. Comece com um gancho forte (Hook).
    3. Use parágrafos curtos.
    4. Inclua uma CTA (Chamada para ação) no final.
    5. Adicione 3 a 5 hashtags relevantes no final.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar a legenda.";
  } catch (error) {
    console.error("Erro ao gerar legenda:", error);
    return "Erro na comunicação com a inteligência artificial.";
  }
};
