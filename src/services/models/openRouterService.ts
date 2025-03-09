
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../types/query';
import { OPENROUTER_MODEL_IDS } from './constants';

// Define accurate OpenRouter model IDs with display names
const OPENROUTER_MODELS = [
  // Anthropic Models
  { id: OPENROUTER_MODEL_IDS.CLAUDE_OPUS, displayName: 'Claude 3.7 Opus' },
  { id: OPENROUTER_MODEL_IDS.CLAUDE_SONNET, displayName: 'Claude 3.5 Sonnet' },
  { id: OPENROUTER_MODEL_IDS.CLAUDE_HAIKU, displayName: 'Claude 3 Haiku' },
  
  // Google Models
  { id: OPENROUTER_MODEL_IDS.GEMINI_PRO, displayName: 'Gemini 1.5 Pro' },
  { id: OPENROUTER_MODEL_IDS.GEMINI_FLASH, displayName: 'Gemini 1.5 Flash' },
  
  // Meta Models
  { id: OPENROUTER_MODEL_IDS.LLAMA_70B, displayName: 'Llama 3.1 70B' },
  { id: OPENROUTER_MODEL_IDS.LLAMA_8B, displayName: 'Llama 3 8B' },
  
  // xAI Models
  { id: OPENROUTER_MODEL_IDS.GROK_1_5, displayName: 'Grok-1.5' },
  
  // DeepSeek Models
  { id: OPENROUTER_MODEL_IDS.DEEPSEEK_V2, displayName: 'DeepSeek V2' },
  { id: OPENROUTER_MODEL_IDS.DEEPSEEK_CODER, displayName: 'DeepSeek Coder' },
  
  // Alibaba Models
  { id: OPENROUTER_MODEL_IDS.QWEN_72B, displayName: 'Qwen2 72B' },
  
  // Perplexity Models
  { id: OPENROUTER_MODEL_IDS.PERPLEXITY_SONAR, displayName: 'Perplexity Sonar' },
  
  // Cohere Models
  { id: OPENROUTER_MODEL_IDS.COHERE_COMMAND, displayName: 'Cohere Command-R+' },
  
  // Mistral Models
  { id: OPENROUTER_MODEL_IDS.MISTRAL_LARGE, displayName: 'Mistral Large' },
  
  // Specialized/Finetuned Models
  { id: OPENROUTER_MODEL_IDS.CLAUDE_3_5_SONNET_MEDICINE, displayName: 'Claude 3.5 Medical' },
  { id: OPENROUTER_MODEL_IDS.LLAMA_3_8B_INSTRUCT_RL, displayName: 'Llama 3 8B (RL-Optimized)' },
  { id: OPENROUTER_MODEL_IDS.OPENCHAT_35, displayName: 'OpenChat 3.5' }
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
  
  // Create a delay between requests to avoid rate limiting
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Process models in batches to avoid overwhelming the API - reduced batch size to minimize rate limiting
  const batchSize = 3; // Reduced from 4 to 3 to minimize rate limiting
  const results: Response[] = [];
  
  try {
    // Process models in batches
    for (let i = 0; i < OPENROUTER_MODELS.length; i += batchSize) {
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(OPENROUTER_MODELS.length/batchSize)}`);
      
      const batch = OPENROUTER_MODELS.slice(i, i + batchSize);
      const batchPromises = batch.map((model, batchIndex) => {
        const modelIndex = i + batchIndex;
        return new Promise<Response>(async (resolve) => {
          try {
            // Get API key for this model using round-robin selection
            const apiKey = getApiKey(apiKeys, modelIndex);
            if (!apiKey) {
              throw new Error(`No valid API key available for model ${model.displayName}`);
            }
            
            // Create unique request ID to prevent caching
            const requestId = `${Date.now()}-${model.id}-${modelIndex}-${Math.random().toString(36).substring(2, 15)}`;
            
            console.log(`Starting request #${modelIndex+1} for model: ${model.displayName} (${model.id}) with API key index ${modelIndex % apiKeys.length}`);
            
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
                max_tokens: 1000, // Increased from 500 to 1000 for more complete responses
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
                  
                  // Wait longer before the next request if rate limited
                  await delay(5000); // Wait 5 seconds if rate limited
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
            // Resolve with null value instead of rejecting to prevent Promise.all from failing
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
        // Process batch in parallel
        const batchResults = await Promise.all(batchPromises);
        
        // Filter out error responses
        const validBatchResults = batchResults.filter(r => r.confidence > 0);
        results.push(...validBatchResults);
        
        console.log(`Batch ${Math.floor(i/batchSize) + 1} complete: ${validBatchResults.length} valid responses from ${batch.length} models`);
        
        // Add increased delay between batches to avoid rate limiting
        if (i + batchSize < OPENROUTER_MODELS.length) {
          console.log(`Waiting 3 seconds before processing next batch to avoid rate limits...`);
          await delay(3000); // Increased from 2s to 3s
        }
      } catch (error) {
        console.error(`Error processing batch ${Math.floor(i/batchSize) + 1}:`, error);
      }
    }
  } catch (error) {
    console.error("Fatal error in batch processing:", error);
  }
  
  // Filter out invalid responses just to be safe
  const finalResponses = results.filter(r => r && r.content && r.source);
  
  // Log the summary of processed responses
  console.log(`🏁 FINAL PROCESSED RESPONSES: ${finalResponses.length} valid from ${OPENROUTER_MODELS.length} total`);
  if (finalResponses.length > 0) {
    console.log('Valid response sources:', finalResponses.map(r => r.source).join(', '));
  } else {
    console.error('❌ No valid responses after processing - check API keys and request parameters');
  }
  
  return finalResponses;
};

// For backward compatibility
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
        max_tokens: 1000, // Increased from 500 to 1000
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
