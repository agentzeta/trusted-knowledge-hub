
import { Response } from '../../types/query';

// Process DeepSeek Coder response
export const fetchFromDeepseek = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) {
    console.log('DeepSeek API key is missing');
    return null;
  }
  
  try {
    console.log('Fetching from DeepSeek Coder with API key:', apiKey.substring(0, 5) + '...');
    
    // Log request payload without the API key
    const requestPayload = {
      model: 'deepseek-coder',
      messages: [{ role: 'user', content: queryText }],
      max_tokens: 150
    };
    console.log('DeepSeek request payload:', JSON.stringify(requestPayload));
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestPayload)
    });
    
    // Log response status
    console.log('DeepSeek response status:', response.status, response.statusText);
    
    // Get response text for better error handling
    const responseText = await response.text();
    console.log('DeepSeek raw response text:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('DeepSeek parsed data:', JSON.stringify(data).substring(0, 100) + '...');
    } catch (parseError) {
      console.error('DeepSeek response is not valid JSON:', parseError);
      return null;
    }
    
    if (!response.ok) {
      // Handle specific error types
      if (response.status === 402) {
        console.error('DeepSeek API error status: 402', responseText);
        // Insufficient balance error
        return null;
      } else {
        console.error(`DeepSeek API error (${response.status}):`, responseText);
        return null;
      }
    }
    
    if (data.error) {
      console.error('DeepSeek API error in response:', data.error);
      return null;
    }
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('DeepSeek API returned unexpected structure:', data);
      return null;
    }
    
    const content = data.choices[0].message.content.trim();
    console.log('DeepSeek Coder response received successfully:', content.substring(0, 50) + '...');
    
    const uniqueId = `deepseek-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      id: uniqueId,
      content: content,
      source: 'DeepSeek Coder',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.85
    };
  } catch (error) {
    console.error('Error fetching from DeepSeek:', error);
    return null;
  }
};
