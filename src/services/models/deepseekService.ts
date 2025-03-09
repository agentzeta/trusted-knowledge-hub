
import { Response } from '../../types/query';

// Process DeepSeek Coder response
export const fetchFromDeepseek = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) {
    console.log('DeepSeek API key is missing');
    return null;
  }
  
  try {
    console.log('Fetching from DeepSeek Coder with API key:', apiKey.substring(0, 5) + '...');
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
    
    // Log complete response for debugging
    const responseText = await response.text();
    console.log('DeepSeek raw response text:', responseText);
    
    // Try to parse the response as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('DeepSeek response is not valid JSON:', parseError);
      return null;
    }
    
    // Check for response status
    if (!response.ok) {
      console.error('DeepSeek API error status:', response.status, responseText);
      return null;
    }
    
    console.log('DeepSeek parsed response:', JSON.stringify(data).substring(0, 200) + '...');
    
    if (data.error) {
      console.error('Deepseek API error:', data.error);
      return null;
    }
    
    console.log('Successfully received response from DeepSeek');
    console.log('DeepSeek choice content:', data.choices?.[0]?.message?.content || 'No content');
    
    const uniqueId = `deepseek-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log('Generated DeepSeek response ID:', uniqueId);
    
    const responseContent = data.choices?.[0]?.message?.content || 'No content returned from DeepSeek';
    
    return {
      id: uniqueId,
      content: responseContent,
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
