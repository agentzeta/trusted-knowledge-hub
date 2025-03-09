
import { Response } from '../../types/query';

// Process Perplexity Sonar response
export const fetchFromPerplexity = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) {
    console.log('Perplexity API key is missing');
    return null;
  }
  
  try {
    console.log('Fetching from Perplexity Sonar with API key:', apiKey.substring(0, 5) + '...');
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
    
    // Log complete response for debugging
    const responseText = await response.text();
    console.log('Perplexity raw response text:', responseText);
    
    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Perplexity response is not valid JSON:', parseError);
      return null;
    }
    
    if (!response.ok) {
      console.error(`Perplexity API error (${response.status}):`, responseText);
      return null;
    }
    
    console.log('Perplexity parsed response:', JSON.stringify(data).substring(0, 200) + '...');
    
    if (data.error) {
      console.error('Perplexity API error:', data.error);
      return null;
    }
    
    console.log('Perplexity Sonar response received successfully');
    console.log('Perplexity choice content:', data.choices?.[0]?.message?.content || 'No content');
    
    const response_id = `perplexity-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log('Generated Perplexity response ID:', response_id);
    
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('Perplexity response missing content');
      return null;
    }
    
    return {
      id: response_id,
      content: content,
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
