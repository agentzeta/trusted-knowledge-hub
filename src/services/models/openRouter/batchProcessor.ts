
import { Response } from '../../../types/query';
import { OPENROUTER_MODELS } from './modelDefinitions';
import { parseApiKeys, delay } from './apiKeyUtils';
import { makeOpenRouterRequest } from './apiRequestHandler';

// Process models in smaller batches to manage API rate limits
export async function processBatchedRequests(
  queryText: string,
  apiKeyString: string
): Promise<Response[]> {
  console.log('=== PROCESSING BATCHED OPENROUTER REQUESTS ===');
  
  // Parse API keys from the string (comma-separated format)
  const apiKeys = parseApiKeys(apiKeyString);
  
  if (apiKeys.length === 0) {
    console.error('No valid OpenRouter API keys found - cannot fetch from models');
    return [];
  }
  
  console.log(`Fetching from ${OPENROUTER_MODELS.length} models using ${apiKeys.length} API keys in round-robin fashion`);
  console.log(`Available models: ${OPENROUTER_MODELS.map(m => m.displayName).join(', ')}`);
  
  // Process models in batches to avoid overwhelming the API
  const batchSize = 3; // Small batch size to minimize rate limiting
  const results: Response[] = [];
  
  try {
    // Process models in batches
    for (let i = 0; i < OPENROUTER_MODELS.length; i += batchSize) {
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(OPENROUTER_MODELS.length/batchSize)}`);
      
      const batch = OPENROUTER_MODELS.slice(i, i + batchSize);
      const batchPromises = batch.map((model, batchIndex) => {
        const modelIndex = i + batchIndex;
        return makeOpenRouterRequest(queryText, model, apiKeys, modelIndex);
      });
      
      try {
        // Process batch in parallel
        const batchResults = await Promise.all(batchPromises);
        
        // Filter out null responses (e.g., from rate limits)
        const validBatchResults = batchResults.filter(r => r !== null) as Response[];
        
        // Filter out error responses
        const successfulResponses = validBatchResults.filter(r => r.confidence > 0);
        results.push(...successfulResponses);
        
        console.log(`Batch ${Math.floor(i/batchSize) + 1} complete: ${successfulResponses.length} valid responses from ${batch.length} models`);
        
        // Add increased delay between batches to avoid rate limiting
        if (i + batchSize < OPENROUTER_MODELS.length) {
          console.log(`Waiting 3 seconds before processing next batch to avoid rate limits...`);
          await delay(3000); 
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
}
