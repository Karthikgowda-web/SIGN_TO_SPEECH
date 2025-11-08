import { GoogleGenAI } from "@google/genai";
import { Language } from '../types';

export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
    // As per guidelines, the API key must come exclusively from an environment variable.
    // For Vite-based React apps, this is typically accessed via import.meta.env.VITE_VAR_NAME.
    // For environments where import.meta.env is not available (e.g., plain browser served HTML),
    // we fall back to a global window variable defined in index.html.
    const apiKey = (import.meta as any).env?.VITE_API_KEY || (window as any).VITE_API_KEY;

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") { // Also check for placeholder
        console.error("VITE_API_KEY environment variable not set or is placeholder for Gemini API.");
        return `[Translation Unavailable] API key not configured. Please ensure VITE_API_KEY is set in your frontend's .env file or in index.html.`;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: apiKey });
        // Using 'gemini-2.5-flash' for general text tasks as per coding guidelines.
        const model = 'gemini-2.5-flash'; 

        // Use a more conversational prompt for translation
        const prompt = `Translate the following text into ${targetLanguage.name} (${targetLanguage.code}). Only provide the translated text, nothing else, and do not include quotation marks around the translated text: "${text}"`;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        
        // The response.text property directly provides the string output.
        return response.text.trim();

    } catch (error: any) {
        console.error("Translation API error:", error);
        
        // Handle specific RESOURCE_EXHAUSTED error
        // Check both error.status for direct API errors and error.message for more generic fetch errors
        if (error.status === 429 || (error.message && error.message.includes("RESOURCE_EXHAUSTED"))) {
            return `[Translation Failed: Quota Exceeded] You've exceeded your current quota for the Gemini API. Please check your plan and billing details. For more information, visit https://ai.google.dev/gemini-api/docs/rate-limits. To monitor usage, visit https://ai.dev/usage?tab=rate-limit.`;
        } else if (error.message && error.message.includes("API_KEY_INVALID")) {
            return `[Translation Failed: Invalid API Key] The provided Gemini API key is invalid. Please ensure VITE_API_KEY is correctly configured in your frontend's .env file or in index.html.`;
        }
        
        // Generic error message for other issues
        return `[Translation Failed] An unexpected error occurred: ${error.message || 'Unknown error'}.`;
    }
};