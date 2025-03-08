
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
  
  // Map for tracking which APIs were attempted
  const attemptedApis = new Map<string, boolean>();
  AI_SOURCES.forEach(source => attemptedApis.set(source, false));
  
  // Create API promises only for those with keys
  const apiPromises = [];
  
  if (apiKeys.openai) {
    apiPromises.push(fetchFromOpenAI(queryText, apiKeys.openai));
    attemptedApis.set('GPT-4o', true);
  }
  
  if (apiKeys.anthropic) {
    apiPromises.push(fetchFromAnthropic(queryText, apiKeys.anthropic));
    attemptedApis.set('Claude 3 Haiku', true);
  }
  
  if (apiKeys.anthropicClaude35) {
    apiPromises.push(fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35));
    attemptedApis.set('Claude 3.5 Sonnet', true);
  }
  
  if (apiKeys.gemini) {
    apiPromises.push(fetchFromGemini(queryText, apiKeys.gemini));
    attemptedApis.set('Gemini 1.5 Pro', true);
  }
  
  if (apiKeys.geminiProExperimental) {
    apiPromises.push(fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental));
    attemptedApis.set('Gemini 1.5 Flash', true);
  }
  
  if (apiKeys.perplexity) {
    apiPromises.push(fetchFromPerplexity(queryText, apiKeys.perplexity));
    attemptedApis.set('Perplexity Sonar', true);
  }
  
  if (apiKeys.deepseek) {
    apiPromises.push(fetchFromDeepseek(queryText, apiKeys.deepseek));
    attemptedApis.set('DeepSeek Coder', true);
  }
  
  console.log(`Attempting to fetch from ${apiPromises.length} LLMs`);
  
  // Execute all API promises
  const apiResults = await Promise.allSettled(apiPromises);
  
  // Filter successful responses only
  const validResponses = apiResults
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => (result as PromiseFulfilledResult<Response>).value);
  
  console.log(`Got ${validResponses.length} valid API responses`);
  
  // Track which sources we already have responses from
  const sourcesWithResponses = validResponses.map(r => r.source);
  console.log('Sources with responses:', sourcesWithResponses);
  
  // Only create mock responses for sources we attempted but failed, and only if we have no valid responses
  let mockResponses: Response[] = [];
  if (validResponses.length === 0) {
    console.log('No valid API responses, using mock responses');
    // Get sources that were attempted but failed
    const attemptedSources = Array.from(attemptedApis.entries())
      .filter(([_, wasAttempted]) => wasAttempted)
      .map(([source, _]) => source);
    
    // Use at least the DeepSeek mock if nothing else
    const sourcesToMock = attemptedSources.length > 0 ? attemptedSources : ['DeepSeek Coder'];
    
    mockResponses = sourcesToMock.map(source => 
      getMockResponse(source, queryText)
    );
  }
  
  const allResponses = [...validResponses, ...mockResponses];
  
  if (allResponses.length === 0) {
    console.error('No responses were generated, either real or mock');
    // If somehow we still have no responses, create at least one mock response
    allResponses.push(getMockResponse('DeepSeek Coder', queryText));
  }
  
  const derivedConsensus = deriveConsensusResponse(allResponses);
  
  return { allResponses, derivedConsensus };
};
