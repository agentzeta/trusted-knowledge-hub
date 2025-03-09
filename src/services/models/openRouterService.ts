
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

// Improved function to fetch from multiple OpenRouter models in parallel with better handling
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKey: string
): Promise<Response[]> => {
  console.log('=== FETCHING FROM MULTIPLE OPENROUTER MODELS ===');
  
  // Define models to query with user-friendly display names
  const models = [
    { id: 'anthropic/claude-3-opus:20240229', displayName: 'Claude 3.7 Opus' },
    { id: 'anthropic/claude-3-sonnet:20240229', displayName: 'Claude 3.5 Sonnet' },
    { id: 'google/gemini-1.5-pro', displayName: 'Gemini 1.5 Pro (OpenRouter)' },
    { id: 'mistralai/mistral-large', displayName: 'Mistral Large' },
    { id: 'meta-llama/llama-3-70b-instruct', displayName: 'Llama 3 70B' },
    { id: 'deepseek-ai/deepseek-v2', displayName: 'DeepSeek V2' },
    { id: 'cohere/command-r-plus', displayName: 'Cohere Command-R+' },
    { id: 'perplexity/sonar-small-online', displayName: 'Perplexity Sonar' }
  ];
  
  console.log(`Will attempt to fetch from ${models.length} OpenRouter models`);
  
  // Create an array of promises for parallel execution
  const modelPromises = models.map(model => {
    return fetchSingleOpenRouterModel(queryText, apiKey, model.id, model.displayName);
  });
  
  try {
    // Wait for all promises to settle and collect results
    const results = await Promise.allSettled(modelPromises);
    
    // Filter successful results
    const validResponses = results
      .filter((result): result is PromiseFulfilledResult<Response> => result.status === 'fulfilled')
      .map(result => result.value);
    
    // Log failed models
    results
      .filter(result => result.status === 'rejected')
      .forEach((result: PromiseRejectedResult) => {
        console.error(`Failed to get response from OpenRouter model:`, result.reason);
      });
    
    console.log(`Successfully received ${validResponses.length} responses from OpenRouter models`);
    console.log('OpenRouter model sources:', validResponses.map(r => r.source).join(', '));
    
    return validResponses;
  } catch (error) {
    console.error('Error fetching from multiple OpenRouter models:', error);
    // Return empty array rather than throwing to prevent one failure from blocking all models
    return [];
  }
};

// Helper function to fetch from a single OpenRouter model with proper error handling
async function fetchSingleOpenRouterModel(
  queryText: string,
  apiKey: string,
  modelId: string,
  displayName: string
): Promise<Response> {
  console.log(`Starting request to OpenRouter model: ${displayName} (${modelId})`);
  
  try {
    // Create a unique nonce for this specific model request to prevent caching
    const nonce = `${modelId}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        extra: { nonce }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error fetching from ${displayName} (${modelId}):`, errorText);
      throw new Error(`Error from ${displayName}: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error(`Invalid response format from ${displayName} (${modelId})`, data);
      throw new Error(`Invalid response format from ${displayName}`);
    }
    
    const content = data.choices[0].message.content;
    
    const responseObj: Response = {
      id: uuidv4(),
      content: content,
      source: displayName,
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };
    
    console.log(`✅ Success: Response from ${displayName} (content length: ${content.length})`);
    return responseObj;
  } catch (error) {
    console.error(`Failed to get response from ${displayName} (${modelId}):`, error);
    throw error;
  }
}
