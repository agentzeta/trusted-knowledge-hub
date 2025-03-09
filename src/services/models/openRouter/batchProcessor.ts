
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../../types/query';
import { OPENROUTER_MODELS } from './modelDefinitions';
import { handleApiRequest } from './apiRequestHandler';
import { validateOpenRouterKey } from './apiKeyUtils';

// Process OpenRouter API requests in optimized batches
export const processBatchedRequests = async (
  queryText: string, 
  apiKey: string,
  signal?: AbortSignal
): Promise<Response[]> => {
  console.log('Processing batched OpenRouter requests');
  
  // Validate the API key first
  const isKeyValid = await validateOpenRouterKey(apiKey);
  if (!isKeyValid) {
    console.error('OpenRouter API key validation failed');
    return [];
  }
  
  // Get top models to query
  const topModels = [
    OPENROUTER_MODELS.find(m => m.id === 'anthropic/claude-3-5-sonnet:20240620'), // 3.5 Sonnet
    OPENROUTER_MODELS.find(m => m.id === 'anthropic/claude-3-opus:20240229'),     // 3 Opus 
    OPENROUTER_MODELS.find(m => m.id === 'meta-llama/llama-3-70b-instruct'),      // Llama 3 70B
    OPENROUTER_MODELS.find(m => m.id === 'google/gemini-1.5-pro'),                // Gemini 1.5 Pro
    OPENROUTER_MODELS.find(m => m.id === 'perplexity/sonar-medium-online'),       // Perplexity Sonar
    OPENROUTER_MODELS.find(m => m.id === 'xai/grok-1.5'),                         // Grok 1.5
    OPENROUTER_MODELS.find(m => m.id === 'qwen/qwen2-72b-instruct'),              // Qwen
    OPENROUTER_MODELS.find(m => m.id === 'openchat/openchat-3.5'),                // OpenChat 3.5
  ].filter(Boolean) as typeof OPENROUTER_MODELS;
  
  if (topModels.length === 0) {
    console.warn('No models selected for batched requests');
    return [];
  }
  
  console.log(`Processing ${topModels.length} OpenRouter models in parallel`);
  
  try {
    // Process models in parallel batches
    const allPromises = topModels.map(model => 
      handleApiRequest(queryText, apiKey, model, signal)
        .catch(error => {
          console.error(`Error processing model ${model.displayName}:`, error);
          return null;
        })
    );
    
    // Wait for all requests to complete
    const results = await Promise.all(allPromises);
    
    // Filter out failed requests and create final response array
    const validResponses = results
      .filter(result => result !== null)
      .map(result => {
        // Each result should have content and display name
        if (!result || !result.content || !result.modelDisplayName) {
          console.warn('Invalid response format from OpenRouter:', result);
          return null;
        }
        
        // Create response object
        return {
          id: uuidv4(),
          content: result.content,
          source: result.modelDisplayName,
          verified: false,
          timestamp: Date.now(),
          confidence: 0.7
        } as Response;
      })
      .filter(Boolean) as Response[];
    
    console.log(`Successfully processed ${validResponses.length} responses from OpenRouter`);
    return validResponses;
  } catch (error) {
    console.error('Error processing batched OpenRouter requests:', error);
    return [];
  }
};
