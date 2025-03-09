import { ApiKeys, Response } from '../../types/query';
import { deriveConsensusResponse } from '../../utils/consensusUtils';
import { toast } from '@/components/ui/use-toast';
import { createApiPromises } from './apiPromiseCreator';
import { processApiResults, handleNoResponses, handleNoApiKeys } from './responseProcessor';

// Keep track of any active AbortController
let activeAbortController: AbortController | null = null;

/**
 * Cancel any ongoing API requests
 */
export const cancelActiveRequests = () => {
  if (activeAbortController) {
    console.log('Cancelling active API requests');
    activeAbortController.abort();
    activeAbortController = null;
    return true;
  }
  return false;
};

/**
 * Main function to fetch responses from all configured AI models
 * With improved error handling and response processing
 */
export const fetchResponses = async (queryText: string, apiKeys: ApiKeys) => {
  console.log('=== Starting fetchResponses with Enhanced Error Handling ===');
  console.log('Query text:', queryText);
  
  // Create new AbortController for this request batch
  activeAbortController = new AbortController();
  const signal = activeAbortController.signal;
  
  // Check which API keys are available
  const availableKeys = Object.keys(apiKeys).filter(k => !!apiKeys[k as keyof ApiKeys]);
  console.log('Available API keys:', availableKeys);
  
  // If no API keys are configured, return early
  if (availableKeys.length === 0) {
    return handleNoApiKeys();
  }
  
  try {
    // Create API promises array
    const { apiPromises, apiSources } = createApiPromises(queryText, apiKeys, signal);
    
    if (apiPromises.length === 0) {
      console.error('No API promises created - no valid API keys found');
      return { 
        allResponses: [], 
        derivedConsensus: "No valid API keys configured. Please add API keys in the settings." 
      };
    }
    
    // Execute all API promises with allSettled to get results regardless of success/failure
    console.log('=== Executing API Calls in Parallel ===');
    console.log(`Executing ${apiPromises.length} API calls to sources:`, apiSources.join(', '));
    
    const apiResults = await Promise.allSettled(apiPromises);
    
    // Clear the active abort controller since the requests are complete
    activeAbortController = null;
    
    console.log('API results received, processing each:');
    let successCount = 0;
    let failureCount = 0;
    
    apiResults.forEach((result, i) => {
      const source = i < apiSources.length ? apiSources[i] : 'Unknown';
      if (result.status === 'fulfilled') {
        // Handle null results (from error handling in apiPromiseCreator)
        if (result.value === null) {
          failureCount++;
          console.warn(`${source}: HANDLED ERROR (returned null)`);
        }
        // Handle array results (like from OpenRouter)
        else if (Array.isArray(result.value)) {
          if (result.value.length > 0) {
            successCount++;
            console.log(`${source}: SUCCESS (array of ${result.value.length} responses)`);
          } else {
            failureCount++;
            console.warn(`${source}: EMPTY ARRAY (no responses)`);
          }
        } 
        // Handle single response
        else {
          successCount++;
          console.log(`${source}: SUCCESS (single response)`);
        }
      } else {
        failureCount++;
        console.error(`${source}: FAILED (${result.reason})`);
      }
    });
    
    console.log(`API calls summary: ${successCount} succeeded, ${failureCount} failed`);
    
    // Process results and collect valid responses with improved handling for arrays
    const validResponses = processApiResults(apiResults, apiSources);
    
    console.log(`After processing, have ${validResponses.length} total valid responses from:`, 
      validResponses.map(r => r.source).join(', '));
    
    // If no valid responses, handle that case
    if (validResponses.length === 0) {
      return handleNoResponses();
    }
    
    // Get consensus response
    const derivedConsensus = deriveConsensusResponse(validResponses);
    console.log('Derived consensus response:', derivedConsensus.substring(0, 100) + '...');
    console.log('=== Completed fetchResponses ===');
    
    return { allResponses: validResponses, derivedConsensus };
  } catch (error) {
    // Clear the active abort controller if there's an error
    activeAbortController = null;
    
    // Check if the error is an AbortError
    if (error.name === 'AbortError') {
      console.log('Fetch operation was aborted by user');
      toast({
        title: "Requests Cancelled",
        description: "AI model queries were cancelled.",
        duration: 3000,
      });
      return { 
        allResponses: [], 
        derivedConsensus: null 
      };
    }
    
    console.error('Unexpected error in fetchResponses:', error);
    toast({
      title: "Error Processing Responses",
      description: "An unexpected error occurred while fetching AI model responses.",
      variant: "destructive",
    });
    
    return { 
      allResponses: [], 
      derivedConsensus: "An error occurred while processing AI model responses. Please try again." 
    };
  }
};
