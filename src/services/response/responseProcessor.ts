
import { Response } from '../../types/query';
import { toast } from '@/components/ui/use-toast';

/**
 * Process API results and extract valid responses
 */
export const processApiResults = (apiResults: PromiseSettledResult<any>[], apiSources: string[]) => {
  let validResponses: Response[] = [];
  
  apiResults.forEach((result, index) => {
    const source = index < apiSources.length ? apiSources[index] : 'Unknown';
    
    if (result.status === 'fulfilled') {
      if (Array.isArray(result.value)) {
        // This is the result from OpenRouter multi-model fetcher
        console.log(`✅ SUCCESS: Received an array of ${result.value.length} responses from ${source}`);
        
        // Add each item from the array as an individual response
        result.value.forEach((item: Response) => {
          if (item) {
            console.log(`Adding OpenRouter response from ${item.source}:`, {
              id: item.id,
              contentLength: item.content.length,
              contentPreview: item.content.substring(0, 50) + '...'
            });
            validResponses.push(item);
          }
        });
      } else if (result.value) {
        console.log(`✅ SUCCESS: API response from ${source}`);
        console.log(`Content preview from ${source}:`, result.value.content.substring(0, 50) + '...');
        validResponses.push(result.value);
      } else {
        console.warn(`⚠️ WARNING: API response from ${source} was fulfilled but returned null`);
      }
    } else {
      console.error(`❌ ERROR: API response from ${source} failed:`, result.reason);
    }
  });
  
  console.log(`Received ${validResponses.length} valid API responses from:`, validResponses.map(r => r.source).join(', '));
  
  // IMPORTANT: Add additional debug to verify response array
  console.log('=== Detailed Response Information ===');
  validResponses.forEach(r => {
    console.log(`Response details for ${r.source}:`, {
      id: r.id,
      contentLength: r.content.length,
      contentPreview: r.content.substring(0, 50) + '...',
      verified: r.verified,
      timestamp: r.timestamp
    });
  });
  
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
