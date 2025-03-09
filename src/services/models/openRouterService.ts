
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../types/query';

// Define accurate OpenRouter model IDs with display names
const OPENROUTER_MODELS = [
  { id: 'anthropic/claude-3-opus:20240229', displayName: 'Claude 3.7 Opus' },
  { id: 'anthropic/claude-3-sonnet:20240229', displayName: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-1.5-pro', displayName: 'Gemini 1.5 Pro' },
  { id: 'mistralai/mistral-large', displayName: 'Mistral Large' },
  { id: 'meta-llama/llama-3-70b-instruct', displayName: 'Llama 3 70B' },
  { id: 'deepseek-ai/deepseek-v2', displayName: 'DeepSeek V2' },
  { id: 'cohere/command-r-plus', displayName: 'Cohere Command-R+' },
  { id: 'perplexity/sonar-small-online', displayName: 'Perplexity Sonar' }
];

// Helper function to parse API keys from a string and validate them
function parseApiKeys(apiKeyString: string): string[] {
  if (!apiKeyString) return [];
  
  const keys = apiKeyString.split(',').map(k => k.trim()).filter(k => k.length > 0);
  console.log(`Parsed ${keys.length} OpenRouter API keys for round-robin assignment`);
  return keys;
}

// Get API key using round-robin selection with detailed logging
function getApiKey(apiKeys: string[], modelIndex: number): string {
  if (!apiKeys || apiKeys.length === 0) return '';
  
  const apiKeyIndex = modelIndex % apiKeys.length;
  const apiKey = apiKeys[apiKeyIndex];
  const modelInfo = OPENROUTER_MODELS[modelIndex % OPENROUTER_MODELS.length];
  
  console.log(`Using OpenRouter API key index ${apiKeyIndex} (of ${apiKeys.length}) for model index ${modelIndex} (${modelInfo.displayName})`);
  
  // Log partial key (first 8 chars) for debugging
  if (apiKey) {
    console.log(`Selected API key: ${apiKey.substring(0, 8)}...`);
  } else {
    console.error('Invalid API key selected');
  }
  
  return apiKey;
}

// Completely rewritten function with improved error handling and logging
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKeyString: string
): Promise<Response[]> => {
  console.log('=== FETCHING FROM MULTIPLE OPENROUTER MODELS WITH IMPROVED API KEY CYCLING ===');
  
  // Parse API keys from the string (comma-separated format)
  const apiKeys = parseApiKeys(apiKeyString);
  
  if (apiKeys.length === 0) {
    console.error('No valid OpenRouter API keys found - cannot fetch from models');
    return [];
  }
  
  console.log(`Fetching from ${OPENROUTER_MODELS.length} models using ${apiKeys.length} API keys in round-robin fashion`);
  console.log(`Available models: ${OPENROUTER_MODELS.map(m => m.displayName).join(', ')}`);
  
  // Create an array of promises, one for each model-API key pair
  const modelPromises = OPENROUTER_MODELS.map((model, index) => {
    return new Promise<Response>(async (resolve) => {
      try {
        // Get API key for this model using round-robin selection
        const apiKey = getApiKey(apiKeys, index);
        if (!apiKey) {
          throw new Error(`No valid API key available for model ${model.displayName}`);
        }
        
        // Create unique request ID to prevent caching
        const requestId = `${Date.now()}-${model.id}-${index}-${Math.random().toString(36).substring(2, 15)}`;
        
        console.log(`Starting request #${index+1} for model: ${model.displayName} (${model.id}) with API key index ${index % apiKeys.length}`);
        
        // Make the API call with extensive error handling
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin, // Required by OpenRouter
            'X-Title': 'Agent Veritas Consensus App'
          },
          body: JSON.stringify({
            model: model.id, // Use exact model ID from documentation
            messages: [
              { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
              { role: 'user', content: queryText }
            ],
            temperature: 0.3,
            max_tokens: 150,
            extra: { requestId } // Add unique ID to prevent caching
          })
        });
        
        // Check status code to handle HTTP errors
        if (!response.ok) {
          // Try to parse error response for details
          let errorDetail = '';
          try {
            const errorJson = await response.json();
            errorDetail = JSON.stringify(errorJson);
            
            // Handle rate limits explicitly (HTTP 429)
            if (response.status === 429) {
              console.error(`RATE LIMIT ERROR for ${model.displayName}: ${errorDetail}`);
            }
          } catch (e) {
            errorDetail = await response.text();
          }
          
          throw new Error(`HTTP ${response.status} error from ${model.displayName}: ${errorDetail}`);
        }
        
        // Parse the successful response
        const data = await response.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error(`Invalid response format from ${model.displayName}`);
        }
        
        const content = data.choices[0].message.content;
        console.log(`✅ SUCCESS! Got response from ${model.displayName} (${content.length} chars)`);
        
        // Return properly formatted response
        resolve({
          id: uuidv4(),
          content: content,
          source: model.displayName,
          verified: false,
          timestamp: Date.now(),
          confidence: 0.7
        });
      } catch (error) {
        console.error(`❌ ERROR fetching from ${model.displayName}:`, error);
        // Resolve with null instead of rejecting to prevent Promise.all from failing
        resolve({
          id: uuidv4(),
          content: `Error fetching from ${model.displayName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          source: `${model.displayName} (Error)`,
          verified: false,
          timestamp: Date.now(),
          confidence: 0
        });
      }
    });
  });
  
  try {
    // Use Promise.all to run all requests in parallel
    // This won't fail even if individual promises fail due to our try/catch in each promise
    console.log('Executing all OpenRouter model requests in parallel...');
    const results = await Promise.all(modelPromises);
    
    // Filter out error responses
    const validResponses = results.filter(r => r.confidence > 0);
    
    console.log(`OpenRouter fetch complete: ${validResponses.length} valid responses from ${OPENROUTER_MODELS.length} models`);
    if (validResponses.length > 0) {
      console.log('Got responses from: ' + validResponses.map(r => r.source).join(', '));
    } else {
      console.error('❌ No valid responses from any OpenRouter models');
    }
    
    return validResponses;
  } catch (error) {
    console.error('Catastrophic error in fetchFromMultipleOpenRouterModels:', error);
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
  // Find model info or use default
  const modelInfo = OPENROUTER_MODELS.find(m => m.id === modelName) || 
    { id: modelName, displayName: modelName.split('/').pop() || 'OpenRouter Model' };
  
  try {
    console.log(`Fetching from single OpenRouter model: ${modelInfo.displayName}`);
    
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: modelInfo.id,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        max_tokens: 150,
        extra: { requestId }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format');
    }
    
    return {
      id: uuidv4(),
      content: data.choices[0].message.content,
      source: modelInfo.displayName,
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };
  } catch (error) {
    console.error(`Error fetching from ${modelInfo.displayName}:`, error);
    throw error;
  }
};
