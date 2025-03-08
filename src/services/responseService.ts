
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
  const apiPromises = [
    fetchFromOpenAI(queryText, apiKeys.openai || ''),
    fetchFromAnthropic(queryText, apiKeys.anthropic || ''),
    fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35 || ''),
    fetchFromGemini(queryText, apiKeys.gemini || ''),
    fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental || ''),
    fetchFromPerplexity(queryText, apiKeys.perplexity || ''),
    fetchFromDeepseek(queryText, apiKeys.deepseek || ''),
  ];
  
  const apiResults = await Promise.all(apiPromises);
  
  const validResponses = apiResults.filter(Boolean) as Response[];
  
  const sourcesWithResponses = validResponses.map(r => r.source);
  const missingModels = AI_SOURCES.filter(source => 
    !sourcesWithResponses.includes(source)
  );
  
  const mockResponses = missingModels.map(source => 
    getMockResponse(source, queryText)
  );
  
  const allResponses = [...validResponses, ...mockResponses];
  
  const derivedConsensus = deriveConsensusResponse(allResponses);
  
  return { allResponses, derivedConsensus };
};
