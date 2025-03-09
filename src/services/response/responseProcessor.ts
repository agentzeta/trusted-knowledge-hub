
import { Response } from '../../types/query';
import { toast } from '@/components/ui/use-toast';

/**
 * Process API results and extract valid responses
 */
export const processApiResults = (apiResults: PromiseSettledResult<any>[], apiSources: string[]) => {
  let validResponses: Response[] = [];
  
  console.log('=== PROCESSING API RESULTS ===');
  console.log(`Processing ${apiResults.length} API results from sources:`, apiSources.join(', '));
  
  apiResults.forEach((result, index) => {
    const source = index < apiSources.length ? apiSources[index] : 'Unknown';
    
    if (result.status === 'fulfilled') {
      // Special handling for OpenRouter which returns an array of responses
      if (Array.isArray(result.value)) {
        console.log(`✅ SUCCESS: Received an array of ${result.value.length} responses from ${source}`);
        
        // Log every response in the array
        result.value.forEach((item: Response, i: number) => {
          console.log(`Array response item #${i+1} from ${item.source || source}:`, {
            id: item.id,
            source: item.source,
            contentLength: item.content?.length || 0
          });
        });
        
        // Add each individual response from the array to our valid responses
        result.value.forEach((item: Response) => {
          if (item && item.content && item.source) {
            validResponses.push(item);
            console.log(`Added response from ${item.source}`);
          } else {
            console.warn(`Invalid item in response array:`, item);
          }
        });
        
      } else if (result.value && result.value.content) {
        // Single response case
        console.log(`✅ SUCCESS: Single API response from ${source}:`, {
          contentLength: result.value.content.length
        });
        
        validResponses.push(result.value);
      } else {
        console.warn(`⚠️ WARNING: API response from ${source} was fulfilled but invalid:`, result.value);
      }
    } else {
      console.error(`❌ ERROR: API response from ${source} failed:`, result.reason);
    }
  });
  
  // Final validation of response array
  validResponses = validResponses.filter(r => {
    if (!r || !r.content || !r.source) {
      console.warn('Filtering out invalid response:', r);
      return false;
    }
    return true;
  });
  
  // Log the final validated responses
  console.log(`Final processed responses: ${validResponses.length}`);
  console.log('Valid response sources:', validResponses.map(r => r.source).join(', '));
  
  return validResponses;
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
