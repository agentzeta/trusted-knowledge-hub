
import { ApiKeys, Response } from '../types/query';
import { 
  AI_SOURCES, 
  fetchFromOpenAI, 
  fetchFromAnthropic, 
  fetchFromAnthropicClaude35, 
  fetchFromGemini, 
  fetchFromGeminiProExp, 
  fetchFromPerplexity, 
  fetchFromDeepseek, 
  getMockResponse 
} from './modelService';
import { deriveConsensusResponse } from '../utils/consensusUtils';

export const fetchResponses = async (queryText: string, apiKeys: ApiKeys) => {
  console.log('Fetching responses with API keys:', Object.keys(apiKeys).filter(k => !!apiKeys[k as keyof ApiKeys]));
  
  const apiPromises = [
    fetchFromOpenAI(queryText, apiKeys.openai || ''),
    fetchFromAnthropic(queryText, apiKeys.anthropic || ''),
    fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35 || ''),
    fetchFromGemini(queryText, apiKeys.gemini || ''),
    fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental || ''),
    fetchFromPerplexity(queryText, apiKeys.perplexity || ''),
    fetchFromDeepseek(queryText, apiKeys.deepseek || ''),
  ];
  
  const apiResults = await Promise.allSettled(apiPromises);
  
  // Filter successful responses only
  const validResponses = apiResults
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => (result as PromiseFulfilledResult<Response>).value);
  
  console.log(`Got ${validResponses.length} valid API responses`);
  
  // Only use mock responses for sources that failed or weren't attempted
  const sourcesWithResponses = validResponses.map(r => r.source);
  const missingModels = AI_SOURCES.filter(source => 
    !sourcesWithResponses.includes(source)
  );
  
  // Only create mock responses if there are NO valid API responses
  let mockResponses: Response[] = [];
  if (validResponses.length === 0) {
    console.log('No valid API responses, using mock responses');
    mockResponses = missingModels.map(source => 
      getMockResponse(source, queryText)
    );
  }
  
  const allResponses = [...validResponses, ...mockResponses];
  
  const derivedConsensus = deriveConsensusResponse(allResponses);
  
  return { allResponses, derivedConsensus };
};
