
import { ApiKeys, Response } from '../types/query';
import { 
  AI_SOURCES, 
  fetchFromOpenAI, 
  fetchFromAnthropic, 
  fetchFromAnthropicClaude35, 
  fetchFromGemini, 
  fetchFromGeminiProExp, 
  fetchFromPerplexity, 
  fetchFromDeepseek
} from './modelService';
import { deriveConsensusResponse } from '../utils/consensusUtils';
import { toast } from '@/components/ui/use-toast';

export const fetchResponses = async (queryText: string, apiKeys: ApiKeys) => {
  const availableKeys = Object.keys(apiKeys).filter(k => !!apiKeys[k as keyof ApiKeys]);
  console.log('Fetching responses with available API keys:', availableKeys);
  
  if (availableKeys.length === 0) {
    toast({
      title: "No API Keys Configured",
      description: "Please add API keys in the settings to use AI models",
      variant: "destructive",
    });
    return { allResponses: [], derivedConsensus: "No API keys configured. Please add API keys in the settings to use AI models." };
  }
  
  // Map for tracking which APIs were attempted
  const attemptedApis = new Map<string, boolean>();
  AI_SOURCES.forEach(source => attemptedApis.set(source, false));
  
  // Create API promises only for those with keys
  const apiPromises = [];
  
  if (apiKeys.openai) {
    console.log('Adding OpenAI API call to queue');
    apiPromises.push(fetchFromOpenAI(queryText, apiKeys.openai));
    attemptedApis.set('GPT-4o', true);
  }
  
  if (apiKeys.anthropic) {
    console.log('Adding Anthropic API call to queue');
    apiPromises.push(fetchFromAnthropic(queryText, apiKeys.anthropic));
    attemptedApis.set('Claude 3 Haiku', true);
  }
  
  if (apiKeys.anthropicClaude35) {
    console.log('Adding Anthropic Claude 3.5 API call to queue');
    apiPromises.push(fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35));
    attemptedApis.set('Claude 3.5 Sonnet', true);
  }
  
  if (apiKeys.gemini) {
    console.log('Adding Gemini API call to queue');
    apiPromises.push(fetchFromGemini(queryText, apiKeys.gemini));
    attemptedApis.set('Gemini 1.5 Pro', true);
  }
  
  if (apiKeys.geminiProExperimental) {
    console.log('Adding Gemini Pro Experimental API call to queue');
    apiPromises.push(fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental));
    attemptedApis.set('Gemini 1.5 Flash', true);
  }
  
  if (apiKeys.perplexity) {
    console.log('Adding Perplexity API call to queue');
    apiPromises.push(fetchFromPerplexity(queryText, apiKeys.perplexity));
    attemptedApis.set('Perplexity Sonar', true);
  }
  
  if (apiKeys.deepseek) {
    console.log('Adding DeepSeek API call to queue');
    apiPromises.push(fetchFromDeepseek(queryText, apiKeys.deepseek));
    attemptedApis.set('DeepSeek Coder', true);
  }
  
  console.log(`Attempting to fetch from ${apiPromises.length} LLMs`);
  
  if (apiPromises.length === 0) {
    toast({
      title: "No API Keys Configured",
      description: "Please add API keys in the settings to use AI models",
      variant: "destructive",
    });
    return { allResponses: [], derivedConsensus: "No API keys configured. Please add API keys in the settings to use AI models." };
  }
  
  // Execute all API promises simultaneously
  const apiResults = await Promise.allSettled(apiPromises);
  
  // Debug information about API responses
  apiResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`API response ${index+1} successful:`, result.value?.source);
    } else {
      console.error(`API response ${index+1} failed:`, result.reason);
    }
  });
  
  // Filter successful responses only
  const validResponses = apiResults
    .filter(result => result.status === 'fulfilled' && result.value)
    .map(result => (result as PromiseFulfilledResult<Response>).value);
  
  console.log(`Received ${validResponses.length} valid API responses from:`, validResponses.map(r => r.source).join(', '));
  
  // Track which sources we already have responses from
  const sourcesWithResponses = validResponses.map(r => r.source);
  console.log('Sources with responses:', sourcesWithResponses);
  
  if (validResponses.length === 0) {
    toast({
      title: "No Valid Responses",
      description: "All API requests failed. Please check your API keys and try again.",
      variant: "destructive",
    });
    return { 
      allResponses: [], 
      derivedConsensus: "All API requests failed. Please check your API keys and try again." 
    };
  }
  
  const derivedConsensus = deriveConsensusResponse(validResponses);
  
  return { allResponses: validResponses, derivedConsensus };
};
