
import { ApiKeys, Response } from '../../types/query';
import { deriveConsensusResponse } from '../../utils/consensusUtils';
import { toast } from '@/components/ui/use-toast';
import { createApiPromises } from './apiPromiseCreator';
import { processApiResults, handleNoResponses, handleNoApiKeys } from './responseProcessor';

/**
 * Main function to fetch responses from all configured AI models
 */
export const fetchResponses = async (queryText: string, apiKeys: ApiKeys) => {
  console.log('=== Starting fetchResponses ===');
  console.log('Query text:', queryText);
  const availableKeys = Object.keys(apiKeys).filter(k => !!apiKeys[k as keyof ApiKeys]);
  console.log('Available API keys:', availableKeys);
  
  // If no API keys are configured, return early
  if (availableKeys.length === 0) {
    return handleNoApiKeys();
  }
  
  // Create API promises array
  const { apiPromises, apiSources } = createApiPromises(queryText, apiKeys);
  
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
  
  console.log('API results received, checking status of each:');
  apiResults.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      if (Array.isArray(result.value)) {
        console.log(`${apiSources[i]}: SUCCESS (array of ${result.value.length} responses)`);
      } else {
        console.log(`${apiSources[i]}: SUCCESS (single response)`);
      }
    } else {
      console.log(`${apiSources[i]}: FAILED (${result.reason})`);
    }
  });
  
  // Process results and collect valid responses
  const validResponses = processApiResults(apiResults, apiSources);
  
  console.log(`After processing, have ${validResponses.length} valid responses from:`, 
    validResponses.map(r => r.source).join(', '));
  
  // If no valid responses, handle that case
  if (validResponses.length === 0) {
    return handleNoResponses();
  }
  
  // Get consensus response
  const derivedConsensus = deriveConsensusResponse(validResponses);
  console.log('Derived consensus response:', derivedConsensus.substring(0, 100) + '...');
  console.log('=== Completed fetchResponses ===');
  
  // Log the final response object being returned
  console.log('Final response object:', {
    responseCount: validResponses.length,
    sources: validResponses.map(r => r.source).join(', '),
    consensusLength: derivedConsensus.length
  });
  
  return { allResponses: validResponses, derivedConsensus };
};
