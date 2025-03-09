
import { Response } from '../../types/query';

// Process Anthropic (Claude 3 Haiku) response
export const fetchFromAnthropic = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) {
    console.log('Anthropic API key is missing');
    return null;
  }
  
  try {
    console.log('Fetching from Claude 3 Haiku with API key:', apiKey.substring(0, 5) + '...');
    
    // Log request payload (without the full API key)
    console.log('Claude request payload:', JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 150,
      messages: [{ role: 'user', content: queryText }]
    }));
    
    // Use a try-catch for the fetch request itself
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
      
      // Log response status
      console.log('Claude 3 Haiku response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Claude API error (${response.status}):`, errorText);
        return null;
      }
      
      // Parse response
      const responseText = await response.text();
      console.log('Claude 3 Haiku raw response:', responseText.substring(0, 200) + '...');
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Claude response is not valid JSON:', parseError);
        return null;
      }
      
      if (data.error) {
        console.error('Anthropic API error:', data.error);
        return null;
      }
      
      // Validate response structure
      if (!data.content || !data.content[0] || !data.content[0].text) {
        console.error('Claude API returned unexpected structure:', data);
        return null;
      }
      
      const content = data.content[0].text;
      console.log('Claude 3 Haiku response received successfully:', content.substring(0, 50) + '...');
      
      const uniqueId = `anthropic-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      console.log('Generated Claude response ID:', uniqueId);
      
      return {
        id: uniqueId,
        content: content,
        source: 'Claude 3 Haiku',
        verified: true,
        timestamp: Date.now(),
        confidence: 0.92
      };
    } catch (fetchError) {
      console.error('Fetch operation to Anthropic API failed:', fetchError);
      // This might be a CORS issue or network problem
      console.log('This could be a CORS issue. If running locally, check if a CORS proxy is needed.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching from Anthropic:', error);
    return null;
  }
};

// Process Anthropic Claude 3.5 Sonnet response
export const fetchFromAnthropicClaude35 = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) {
    console.log('Anthropic Claude 3.5 API key is missing');
    return null;
  }
  
  try {
    console.log('Fetching from Claude 3.5 Sonnet with API key:', apiKey.substring(0, 5) + '...');
    
    // Log request payload (without the full API key)
    console.log('Claude 3.5 request payload:', JSON.stringify({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 150,
      messages: [{ role: 'user', content: queryText }]
    }));
    
    // Use a try-catch for the fetch request itself
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
      
      // Log response status
      console.log('Claude 3.5 Sonnet response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Claude 3.5 API error (${response.status}):`, errorText);
        return null;
      }
      
      // Parse response
      const responseText = await response.text();
      console.log('Claude 3.5 Sonnet raw response:', responseText.substring(0, 200) + '...');
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Claude 3.5 response is not valid JSON:', parseError);
        return null;
      }
      
      if (data.error) {
        console.error('Claude 3.5 API error:', data.error);
        return null;
      }
      
      // Validate response structure
      if (!data.content || !data.content[0] || !data.content[0].text) {
        console.error('Claude 3.5 API returned unexpected structure:', data);
        return null;
      }
      
      const content = data.content[0].text;
      console.log('Claude 3.5 Sonnet response received successfully:', content.substring(0, 50) + '...');
      
      const uniqueId = `anthropic35-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      console.log('Generated Claude 3.5 response ID:', uniqueId);
      
      return {
        id: uniqueId,
        content: content,
        source: 'Claude 3.5 Sonnet',
        verified: true,
        timestamp: Date.now(),
        confidence: 0.94
      };
    } catch (fetchError) {
      console.error('Fetch operation to Claude 3.5 API failed:', fetchError);
      // This might be a CORS issue or network problem
      console.log('This could be a CORS issue. If running locally, check if a CORS proxy is needed.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching from Claude 3.5:', error);
    return null;
  }
};
