
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../types/query';

export const fetchFromOpenRouter = async (
  queryText: string, 
  apiKey: string, 
  modelName: string = 'anthropic/claude-3-opus:20240229'
): Promise<Response> => {
  console.log('Fetching from OpenRouter:', modelName);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        // Add unique request ID to prevent response caching
        extra: {
          nonce: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API Response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    const content = data.choices[0].message.content;
    
    // Extract model name from the response or use the provided model name
    const modelUsed = data.model.split('/').pop() || modelName;
    
    return {
      id: uuidv4(),
      content,
      source: modelUsed, // Use clean model name
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };
  } catch (error) {
    console.error('Error fetching from OpenRouter:', error);
    throw error;
  }
};

// Updated function to fetch from multiple OpenRouter models INDIVIDUALLY
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKey: string
): Promise<Response[]> => {
  console.log('=== FETCHING FROM MULTIPLE OPENROUTER MODELS ===');
  
  // Define models to query individually
  const models = [
    { name: 'anthropic/claude-3-opus:20240229', displayName: 'Claude 3.7 Opus' },
    { name: 'anthropic/claude-3-sonnet:20240229', displayName: 'Claude 3.5 Sonnet' },
    { name: 'google/gemini-1.5-pro', displayName: 'Gemini 1.5 Pro (OpenRouter)' },
    { name: 'mistralai/mistral-large', displayName: 'Mistral Large' },
    { name: 'meta-llama/llama-3-70b-instruct', displayName: 'Llama 3 70B' },
    { name: 'deepseek-ai/deepseek-v2', displayName: 'DeepSeek V2' },
    { name: 'cohere/command-r-plus', displayName: 'Cohere Command-R+' },
    { name: 'perplexity/sonar-small-online', displayName: 'Perplexity Sonar' }
  ];
  
  console.log(`Will attempt to fetch from ${models.length} OpenRouter models`);
  
  // Create an array of promises for parallel execution
  const promises = models.map(model => {
    return new Promise<Response>(async (resolve, reject) => {
      try {
        console.log(`Starting request to OpenRouter model: ${model.displayName}`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Agent Veritas Consensus App'
          },
          body: JSON.stringify({
            model: model.name,
            messages: [
              { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
              { role: 'user', content: queryText }
            ],
            temperature: 0.3,
            // Add unique client ID to prevent response caching
            extra: {
              nonce: `${model.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
            }
          })
        });
        
        // Handle potential errors
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error fetching from ${model.displayName}:`, errorText);
          reject(new Error(`Error from ${model.displayName}: ${errorText}`));
          return;
        }
        
        const data = await response.json();
        
        // Verify response format
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          console.error(`Invalid response format from ${model.displayName}`);
          reject(new Error(`Invalid response format from ${model.displayName}`));
          return;
        }
        
        const content = data.choices[0].message.content;
        
        // Add response to array
        const responseObj: Response = {
          id: uuidv4(),
          content: content,
          source: model.displayName,
          verified: false,
          timestamp: Date.now(),
          confidence: 0.7
        };
        
        console.log(`✅ Success: Response from ${model.displayName}`);
        resolve(responseObj);
        
      } catch (error) {
        console.error(`Failed to get response from ${model.displayName}:`, error);
        reject(error);
      }
    });
  });
  
  // Execute all promises and collect successful responses
  const results = await Promise.allSettled(promises);
  
  const validResponses = results
    .filter((result): result is PromiseFulfilledResult<Response> => result.status === 'fulfilled')
    .map(result => result.value);
  
  console.log(`Successfully received ${validResponses.length} responses from OpenRouter models`);
  console.log('OpenRouter model sources:', validResponses.map(r => r.source).join(', '));
  
  return validResponses;
};
