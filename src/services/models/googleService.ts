
import { Response } from '../../types/query';

// Process Gemini 1.5 Pro response
export const fetchFromGemini = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    console.log('Fetching from Gemini 1.5 Pro...');
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return null;
    }
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Gemini API returned unexpected structure:', data);
      return null;
    }
    
    console.log('Gemini 1.5 Pro response received successfully');
    
    const uniqueId = `gemini-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: uniqueId,
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
    console.log('Fetching from Gemini 1.5 Flash...');
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini 1.5 Flash API error (${response.status}):`, errorText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini 1.5 Flash API error:', data.error);
      return null;
    }
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      console.error('Gemini 1.5 Flash API returned unexpected structure:', data);
      return null;
    }
    
    console.log('Gemini 1.5 Flash response received successfully');
    
    const uniqueId = `gemini-flash-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: uniqueId,
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
