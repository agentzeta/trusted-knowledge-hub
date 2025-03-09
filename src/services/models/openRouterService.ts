
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../types/query';

// Single OpenRouter model fetch with improved error handling
export const fetchFromOpenRouter = async (
  queryText: string, 
  apiKey: string, 
  modelName: string = 'anthropic/claude-3-opus:20240229'
): Promise<Response> => {
  console.log(`Fetching from OpenRouter with specific model: ${modelName}`);
  
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
        model: modelName, // Explicitly specify the model here
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        // Add unique request ID to prevent caching
        extra: {
          nonce: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = `OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`;
      console.error('OpenRouter API Error:', errorData, errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log(`OpenRouter API Response for ${modelName}:`, {
      model: data.model,
      responseLength: data.choices?.[0]?.message?.content?.length || 0
    });

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`Invalid response format from OpenRouter API for model ${modelName}`);
    }

    const content = data.choices[0].message.content;
    
    // Extract model name from the response or use the provided model name
    const modelUsed = data.model.split('/').pop() || modelName.split('/').pop() || modelName;
    
    return {
      id: uuidv4(),
      content,
      source: modelUsed, // Use clean model name
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };
  } catch (error) {
    // Log the full error
    console.error(`Error fetching from OpenRouter model ${modelName}:`, error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
};

// Define a fixed set of models with API-compatible IDs and user-friendly display names
const OPENROUTER_MODELS = [
  { id: 'anthropic/claude-3-opus:20240229', displayName: 'Claude 3.7 Opus' },
  { id: 'anthropic/claude-3-sonnet:20240229', displayName: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-1.5-pro', displayName: 'Gemini 1.5 Pro (OpenRouter)' },
  { id: 'mistralai/mistral-large', displayName: 'Mistral Large' },
  { id: 'meta-llama/llama-3-70b-instruct', displayName: 'Llama 3 70B' },
  { id: 'deepseek-ai/deepseek-v2', displayName: 'DeepSeek V2' },
  { id: 'cohere/command-r-plus', displayName: 'Cohere Command-R+' },
  { id: 'perplexity/sonar-small-online', displayName: 'Perplexity Sonar' }
];

// Completely rewritten function to implement API key cycling and parallel model requests
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKey: string
): Promise<Response[]> => {
  console.log('=== FETCHING FROM MULTIPLE OPENROUTER MODELS WITH IMPROVED ERROR HANDLING ===');
  console.log(`Will attempt to fetch from ${OPENROUTER_MODELS.length} OpenRouter models`);
  
  // If we have multiple API keys (comma-separated), split them for round-robin assignment
  const apiKeys = apiKey.includes(',') ? apiKey.split(',').map(k => k.trim()) : [apiKey];
  console.log(`Using ${apiKeys.length} OpenRouter API key(s) for round-robin assignment`);
  
  // Create model request promises using round-robin API key assignment
  const modelPromises = OPENROUTER_MODELS.map((model, index) => {
    // Select API key in round-robin fashion
    const selectedApiKey = apiKeys[index % apiKeys.length];
    
    // Create unique nonce for this specific request
    const nonce = `${model.id}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${index}`;
    
    console.log(`Starting request #${index+1} to OpenRouter model: ${model.displayName} (${model.id}) with API key index ${index % apiKeys.length}`);
    
    // Return a promise to fetch from this model
    return fetchSingleOpenRouterModelWithErrorHandling(
      queryText, 
      selectedApiKey,
      model.id, 
      model.displayName,
      nonce,
      index
    );
  });
  
  // Wait for all requests to settle, capture results
  const results = await Promise.allSettled(modelPromises);
  
  // Process results
  console.log(`All ${results.length} OpenRouter model requests completed. Processing results...`);
  
  // Filter successful results
  const validResponses: Response[] = [];
  
  results.forEach((result, index) => {
    const modelInfo = index < OPENROUTER_MODELS.length ? OPENROUTER_MODELS[index] : { displayName: 'Unknown', id: 'unknown' };
    
    if (result.status === 'fulfilled') {
      console.log(`✅ Model #${index+1} (${modelInfo.displayName}) succeeded with content length: ${result.value.content.length}`);
      validResponses.push(result.value);
    } else {
      console.error(`❌ Model #${index+1} (${modelInfo.displayName}) failed:`, result.reason);
    }
  });
  
  console.log(`Retrieved ${validResponses.length} valid responses from OpenRouter models`);
  if (validResponses.length > 0) {
    console.log('OpenRouter model sources:', validResponses.map(r => r.source).join(', '));
  } else {
    console.warn('NO VALID RESPONSES from any OpenRouter models');
  }
  
  return validResponses;
};

// Helper function to fetch from a single OpenRouter model with proper error handling
async function fetchSingleOpenRouterModelWithErrorHandling(
  queryText: string,
  apiKey: string,
  modelId: string,
  displayName: string,
  nonce: string,
  index: number
): Promise<Response> {
  console.log(`Starting request for OpenRouter model #${index+1}: ${displayName} (${modelId})`);
  
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
        model: modelId, // Explicitly specify the model ID
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
      const errorMessage = `Error from ${displayName}: ${response.status} - ${errorText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      const invalidFormatMessage = `Invalid response format from ${displayName}`;
      console.error(invalidFormatMessage, data);
      throw new Error(invalidFormatMessage);
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
    throw error; // Re-throw to be caught by Promise.allSettled
  }
}
