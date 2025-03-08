
import { Response } from '../../types/query';

// Process Gemini 1.5 Pro response
export const fetchFromGemini = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: queryText }] }],
        generationConfig: {
          maxOutputTokens: 150,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return null;
    }
    
    return {
      id: `gemini-${Date.now()}`,
      content: data.candidates[0].content.parts[0].text,
      source: 'Gemini 1.5 Pro',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.85
    };
  } catch (error) {
    console.error('Error fetching from Gemini:', error);
    return null;
  }
};

// Process Gemini 1.5 Flash response
export const fetchFromGeminiProExp = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: queryText }] }],
        generationConfig: {
          maxOutputTokens: 150,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini 1.5 Flash API error:', data.error);
      return null;
    }
    
    return {
      id: `gemini-flash-${Date.now()}`,
      content: data.candidates[0].content.parts[0].text,
      source: 'Gemini 1.5 Flash',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.88
    };
  } catch (error) {
    console.error('Error fetching from Gemini 1.5 Flash:', error);
    return null;
  }
};
