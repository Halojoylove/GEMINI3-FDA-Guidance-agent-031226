import { GoogleGenAI } from '@google/genai';

export const callGemini = async (
  model: string,
  systemPrompt: string,
  userInput: string,
  maxTokens: number,
  temperature: number,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error('Gemini API key is missing.');
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userInput,
      config: {
        systemInstruction: systemPrompt || undefined,
        temperature: temperature,
        maxOutputTokens: maxTokens,
      },
    });

    return response.text || '';
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

export const callLLM = async (
  provider: string,
  model: string,
  systemPrompt: string,
  userInput: string,
  maxTokens: number,
  temperature: number,
  apiKeys: Record<string, string>
): Promise<string> => {
  if (provider === 'gemini') {
    return callGemini(model, systemPrompt, userInput, maxTokens, temperature, apiKeys.gemini);
  } else {
    // Mock other providers for now
    return `Mock response from ${provider} (${model}). Please configure the backend to support this provider.`;
  }
};
