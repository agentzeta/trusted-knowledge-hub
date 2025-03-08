
import { Response } from '../../types/query';

// Process OpenAI (GPT-4o) response
export const fetchFromOpenAI = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: queryText }],
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return null;
    }
    
    return {
      id: `openai-${Date.now()}`,
      content: data.choices[0].message.content.trim(),
      source: 'GPT-4o',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.9
    };
  } catch (error) {
    console.error('Error fetching from OpenAI:', error);
    return null;
  }
};
