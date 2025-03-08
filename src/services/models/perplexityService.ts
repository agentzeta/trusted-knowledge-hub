
import { Response } from '../../types/query';

// Process Perplexity Sonar response
export const fetchFromPerplexity = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Be precise and concise.'
          },
          {
            role: 'user',
            content: queryText
          }
        ],
        max_tokens: 150,
      }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Perplexity API error:', data.error);
      return null;
    }
    
    return {
      id: `perplexity-${Date.now()}`,
      content: data.choices[0].message.content,
      source: 'Perplexity Sonar',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.88
    };
  } catch (error) {
    console.error('Error fetching from Perplexity:', error);
    return null;
  }
};
