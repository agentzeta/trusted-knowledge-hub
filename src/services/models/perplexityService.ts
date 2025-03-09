
import { Response } from '../../types/query';

// Process Perplexity Sonar response
export const fetchFromPerplexity = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    console.log('Fetching from Perplexity Sonar...');
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API error (${response.status}):`, errorText);
      return null;
    }
    
    const data = await response.json();
    console.log('Perplexity raw response:', JSON.stringify(data).substring(0, 200) + '...');
    
    if (data.error) {
      console.error('Perplexity API error:', data.error);
      return null;
    }
    
    console.log('Perplexity Sonar response received successfully');
    
    const response_id = `perplexity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log('Generated Perplexity response ID:', response_id);
    
    return {
      id: response_id,
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
