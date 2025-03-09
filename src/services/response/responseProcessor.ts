
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
        
        // Log every response in the array to verify we're getting them all
        result.value.forEach((item: Response, i: number) => {
          console.log(`OpenRouter array item #${i+1}:`, {
            source: item.source,
            id: item.id,
            contentLength: item.content?.length || 0,
            contentSample: item.content?.substring(0, 40) + '...' || 'No content'
          });
        });
        
        // Add each response individually from the array
        result.value.forEach((item: Response) => {
          // Make sure we have a valid response with content
          if (item && item.content) {
            console.log(`Adding response from ${item.source || source}:`, {
              id: item.id,
              contentLength: item.content.length,
              contentPreview: item.content.substring(0, 50) + '...'
            });
            
            validResponses.push({
              id: item.id,
              content: item.content,
              source: item.source || `Model #${validResponses.length + 1}`,
              verified: false,
              timestamp: item.timestamp || Date.now(),
              confidence: item.confidence || 0.7
            });
          } else {
            console.warn(`⚠️ WARNING: Invalid item in OpenRouter response array:`, item);
          }
        });
        
        // Verify how many responses we've added
        console.log(`After adding OpenRouter responses, total valid responses: ${validResponses.length}`);
      } else if (result.value && result.value.content) {
        // Single response case
        console.log(`✅ SUCCESS: API response from ${source}:`, {
          contentLength: result.value.content.length,
          contentPreview: result.value.content.substring(0, 50) + '...'
        });
        
        validResponses.push(result.value);
      } else {
        console.warn(`⚠️ WARNING: API response from ${source} was fulfilled but returned invalid data:`, result.value);
      }
    } else {
      console.error(`❌ ERROR: API response from ${source} failed:`, result.reason);
    }
  });
  
  console.log(`Processed ${apiResults.length} API results into ${validResponses.length} valid responses`);
  console.log('Valid response sources:', validResponses.map(r => r.source).join(', '));
  
  // Final validation of response array
  validResponses = validResponses.filter(r => {
    if (!r || !r.content || !r.source) {
      console.warn('Filtering out invalid response:', r);
      return false;
    }
    return true;
  });
  
  // Detailed logging of final responses
  console.log('=== FINAL RESPONSES ===');
  validResponses.forEach((r, i) => {
    console.log(`Response #${i+1} - ${r.source}:`, {
      id: r.id,
      contentLength: r.content.length,
      contentSample: r.content.substring(0, 40) + '...',
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
