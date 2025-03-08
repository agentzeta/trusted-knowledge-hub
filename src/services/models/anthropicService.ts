
import { Response } from '../../types/query';

// Process Anthropic (Claude 3 Haiku) response
export const fetchFromAnthropic = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 150,
        messages: [{ role: 'user', content: queryText }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Anthropic API error:', data.error);
      return null;
    }
    
    return {
      id: `anthropic-${Date.now()}`,
      content: data.content[0].text,
      source: 'Claude 3 Haiku',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.92
    };
  } catch (error) {
    console.error('Error fetching from Anthropic:', error);
    return null;
  }
};

// Process Anthropic Claude 3.5 Sonnet response
export const fetchFromAnthropicClaude35 = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 150,
        messages: [{ role: 'user', content: queryText }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Claude 3.5 API error:', data.error);
      return null;
    }
    
    return {
      id: `anthropic35-${Date.now()}`,
      content: data.content[0].text,
      source: 'Claude 3.5 Sonnet',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.94
    };
  } catch (error) {
    console.error('Error fetching from Claude 3.5:', error);
    return null;
  }
};
