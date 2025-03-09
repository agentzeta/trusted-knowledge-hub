
import { Response } from '../../types/query';
import { toast } from '@/components/ui/use-toast';

/**
 * Process API results and extract valid responses with improved error handling
 */
export const processApiResults = (apiResults: PromiseSettledResult<any>[], apiSources: string[]) => {
  let validResponses: Response[] = [];
  
  console.log('=== PROCESSING API RESULTS ===');
  console.log(`Processing ${apiResults.length} API results from sources:`, apiSources.join(', '));
  
  apiResults.forEach((result, index) => {
    const source = index < apiSources.length ? apiSources[index] : 'Unknown';
    
    if (result.status === 'fulfilled') {
      // Special handling for responses that return an array of responses (like OpenRouter)
      if (Array.isArray(result.value)) {
        console.log(`✅ SUCCESS: Received an array of ${result.value.length} responses from ${source}`);
        
        // Skip empty arrays
        if (result.value.length === 0) {
          console.warn(`⚠️ WARNING: Empty array received from ${source}`);
          return;
        }
        
        // Log every response in the array
        result.value.forEach((item: Response, i: number) => {
          if (item && item.content && item.source) {
            console.log(`Array response item #${i+1} from ${item.source}: Content length ${item.content.length}`);
          } else {
            console.warn(`⚠️ WARNING: Invalid item in array from ${source}:`, item);
          }
        });
        
        // Validate each response in the array
        const validArrayResponses = result.value.filter((item: Response) => {
          return item && item.content && item.source;
        });
        
        // Add each validated response to our valid responses
        if (validArrayResponses.length > 0) {
          validResponses = [...validResponses, ...validArrayResponses];
          console.log(`✅ Added ${validArrayResponses.length} valid responses from ${source} array`);
        } else {
          console.warn(`⚠️ WARNING: No valid responses from ${source} array`);
        }
        
      } else if (result.value && result.value.content) {
        // Single response case
        console.log(`✅ SUCCESS: Single response from ${source}: Content length ${result.value.content.length}`);
        validResponses.push(result.value);
      } else {
        console.warn(`⚠️ WARNING: Response from ${source} was fulfilled but invalid:`, result.value);
      }
    } else {
      // Error handling with detailed logging
      try {
        const errorMessage = result.reason?.message || 'Unknown error';
        const errorStack = result.reason?.stack || '';
        console.error(`❌ ERROR: Response from ${source} failed: ${errorMessage}`);
        if (errorStack) {
          console.error(`Stack trace: ${errorStack}`);
        }
      } catch (e) {
        console.error(`❌ ERROR: Response from ${source} failed with unparseable error`);
      }
    }
  });
  
  // Filter out invalid responses just to be safe
  const finalResponses = validResponses.filter(r => r && r.content && r.source);
  
  // Log the summary of processed responses
  console.log(`🏁 FINAL PROCESSED RESPONSES: ${finalResponses.length} valid from ${apiResults.length} total`);
  console.log('Valid response sources:', finalResponses.map(r => r.source).join(', '));
  
  return finalResponses;
};

/**
 * Handle error cases when no valid responses are received
 */
export const handleNoResponses = () => {
  console.error('No valid responses received from any API');
  toast({
    title: "No Valid Responses",
    description: "All API requests failed. Please check your API keys and try again.",
    variant: "destructive",
  });
  
  return { 
    allResponses: [], 
    derivedConsensus: "All API requests failed. Please check your API keys and try again." 
  };
};

/**
 * Handle error cases when no API keys are configured
 */
export const handleNoApiKeys = () => {
  console.warn('No API keys configured');
  toast({
    title: "No API Keys Configured",
    description: "Please add API keys in the settings to use AI models",
    variant: "destructive",
  });
  
  return { 
    allResponses: [], 
    derivedConsensus: "No API keys configured. Please add API keys in the settings to use AI models." 
  };
};
