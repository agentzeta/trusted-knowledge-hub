
import { Response } from '../../types/query';

// Process OpenAI (GPT-4o) response
export const fetchFromOpenAI = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) {
    console.log('OpenAI API key is missing');
    return null;
  }
  
  try {
    console.log('Fetching from OpenAI (GPT-4o) with API key:', apiKey.substring(0, 5) + '...');
    
    // Log request payload (without the full API key)
    console.log('OpenAI request payload:', JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: queryText }],
      max_tokens: 150
    }));
    
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
    
    // Log response status
    console.log('OpenAI response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorData);
      return null;
    }
    
    // Parse response
    const responseText = await response.text();
    console.log('OpenAI raw response:', responseText.substring(0, 200) + '...');
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('OpenAI response is not valid JSON:', parseError);
      return null;
    }
    
    if (data.error) {
      console.error('OpenAI API error in response:', data.error);
      return null;
    }
    
    // Validate response structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('OpenAI API returned unexpected structure:', data);
      return null;
    }
    
    const content = data.choices[0].message.content.trim();
    console.log('Successfully received response from OpenAI GPT-4o:', content.substring(0, 50) + '...');
    
    const uniqueId = `openai-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    console.log('Generated OpenAI response ID:', uniqueId);
    
    return {
      id: uniqueId,
      content: content,
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
