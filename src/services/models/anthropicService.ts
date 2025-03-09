
import { Response } from '../../types/query';

// Process Anthropic (Claude 3 Haiku) response
export const fetchFromAnthropic = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    console.log('Fetching from Claude 3 Haiku...');
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Claude API error (${response.status}):`, errorText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Anthropic API error:', data.error);
      return null;
    }
    
    console.log('Claude 3 Haiku response received successfully');
    
    const uniqueId = `anthropic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: uniqueId,
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
    console.log('Fetching from Claude 3.5 Sonnet...');
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Claude 3.5 API error (${response.status}):`, errorText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Claude 3.5 API error:', data.error);
      return null;
    }
    
    console.log('Claude 3.5 Sonnet response received successfully');
    
    const uniqueId = `anthropic35-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: uniqueId,
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
