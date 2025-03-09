import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../types/query';

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

// Helper function to select API key in round-robin fashion
function getApiKey(apiKeys: string[], modelIndex: number): string {
  if (!apiKeys || apiKeys.length === 0) return '';
  const apiKeyIndex = modelIndex % apiKeys.length;
  const apiKey = apiKeys[apiKeyIndex];
  console.log(`Using OpenRouter API key index ${apiKeyIndex} for model index ${modelIndex}`);
  return apiKey;
}

// Completely rewritten function to implement API key cycling and parallel model requests
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKey: string
): Promise<Response[]> => {
  console.log('=== FETCHING FROM MULTIPLE OPENROUTER MODELS WITH IMPROVED ERROR HANDLING ===');
  
  // If we have multiple API keys (comma-separated), split them for round-robin assignment
  const apiKeys = apiKey.includes(',') ? apiKey.split(',').map(k => k.trim()) : [apiKey];
  console.log(`Using ${apiKeys.length} OpenRouter API key(s) for round-robin assignment`);
  
  if (apiKeys.length === 0 || !apiKeys[0]) {
    console.error('No valid OpenRouter API keys found');
    return [];
  }
  
  // Map each model to a promise that fetches its response
  const modelPromises = OPENROUTER_MODELS.map((model, index) => {
    // Get API key for this model using round-robin selection
    const selectedApiKey = getApiKey(apiKeys, index);
    
    // Create unique request ID to prevent caching
    const requestId = `${Date.now()}-${model.id}-${index}-${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`Starting request for OpenRouter model #${index+1}: ${model.displayName} (${model.id}) with API key index ${index % apiKeys.length}`);
    
    // Return promise to fetch from this model
    return fetchSingleOpenRouterModel(queryText, selectedApiKey, model.id, model.displayName, requestId);
  });
  
  try {
    // Wait for all promises to settle (success or failure)
    const results = await Promise.allSettled(modelPromises);
    
    // Process results and collect successful responses
    const validResponses: Response[] = [];
    
    results.forEach((result, index) => {
      const modelInfo = index < OPENROUTER_MODELS.length ? OPENROUTER_MODELS[index] : { displayName: 'Unknown', id: 'unknown' };
      
      if (result.status === 'fulfilled') {
        console.log(`✅ Success: Model #${index+1} (${modelInfo.displayName}) returned valid response`);
        validResponses.push(result.value);
      } else {
        console.error(`❌ Error: Model #${index+1} (${modelInfo.displayName}) failed: ${result.reason}`);
      }
    });
    
    console.log(`Retrieved ${validResponses.length} valid responses from ${OPENROUTER_MODELS.length} OpenRouter models`);
    if (validResponses.length > 0) {
      console.log('Retrieved from models:', validResponses.map(r => r.source).join(', '));
    }
    
    return validResponses;
  } catch (error) {
    console.error('Unexpected error in fetchFromMultipleOpenRouterModels:', error);
    return [];
  }
};

// Improved function to fetch from a single model with proper error handling
async function fetchSingleOpenRouterModel(
  queryText: string,
  apiKey: string,
  modelId: string,
  displayName: string,
  requestId: string
): Promise<Response> {
  try {
    // Log model and API key being used (without revealing full key)
    const keyPreview = apiKey ? `${apiKey.substring(0, 8)}...` : 'MISSING';
    console.log(`Fetching from OpenRouter model ${displayName} (${modelId}) with API key ${keyPreview}`);
    
    if (!apiKey) {
      throw new Error('No API key provided for OpenRouter');
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: modelId, // Explicitly specify the correct model ID
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        // Add unique request ID to prevent caching
        extra: { requestId }
      })
    });
    
    // Handle non-success HTTP responses
    if (!response.ok) {
      let errorText = '';
      try {
        const errorResponse = await response.json();
        errorText = JSON.stringify(errorResponse);
      } catch (e) {
        errorText = await response.text();
      }
      
      console.error(`HTTP error ${response.status} from ${displayName}: ${errorText}`);
      throw new Error(`Error ${response.status} from ${displayName}: ${errorText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error(`Invalid response format from ${displayName}:`, data);
      throw new Error(`Invalid response format from ${displayName}`);
    }
    
    const content = data.choices[0].message.content;
    console.log(`Success! Got response from ${displayName} (${content.length} chars)`);
    
    // Return properly formatted response
    return {
      id: uuidv4(),
      content: content,
      source: displayName,
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };
  } catch (error) {
    console.error(`Failed to get response from ${displayName}:`, error);
    throw error; // Re-throw to be handled by Promise.allSettled
  }
}

// Single OpenRouter model fetch - keeping for compatibility but improved
export const fetchFromOpenRouter = async (
  queryText: string, 
  apiKey: string, 
  modelName: string = 'anthropic/claude-3-opus:20240229'
): Promise<Response> => {
  // Find the corresponding model info from our defined models
  const modelInfo = OPENROUTER_MODELS.find(m => m.id === modelName) || 
    { id: modelName, displayName: modelName.split('/').pop() || 'OpenRouter Model' };
  
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  return fetchSingleOpenRouterModel(queryText, apiKey, modelInfo.id, modelInfo.displayName, requestId);
};
