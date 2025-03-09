
import { Response } from '../../types/query';

// Process DeepSeek Coder response
export const fetchFromDeepseek = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    console.log('Fetching from DeepSeek Coder with valid API key...');
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
    console.log('DeepSeek raw response:', JSON.stringify(data).substring(0, 200) + '...');
    
    if (data.error) {
      console.error('Deepseek API error:', data.error);
      return null;
    }
    
    console.log('Successfully received response from DeepSeek');
    
    const uniqueId = `deepseek-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: uniqueId,
      content: data.choices?.[0]?.message?.content || '',
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
