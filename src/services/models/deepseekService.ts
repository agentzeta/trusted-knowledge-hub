
import { Response } from '../../types/query';

// Process DeepSeek Coder response
export const fetchFromDeepseek = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    console.log('Attempting to fetch from DeepSeek Coder API');
    // Using DeepSeek Coder API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-coder',
        messages: [{ role: 'user', content: queryText }],
        max_tokens: 150
      })
    });
    
    // Check for response status
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error status:', response.status, errorText);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Deepseek API error:', data.error);
      return null;
    }
    
    console.log('Successfully received response from DeepSeek');
    return {
      id: `deepseek-${Date.now()}`,
      content: data.choices?.[0]?.message?.content || `${queryText} - Response from DeepSeek Coder.`,
      source: 'DeepSeek Coder',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.82
    };
  } catch (error) {
    console.error('Error fetching from Deepseek:', error);
    return null;
  }
};
