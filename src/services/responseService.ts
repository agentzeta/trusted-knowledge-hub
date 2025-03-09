
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
  console.log('=== Starting fetchResponses ===');
  console.log('Query text:', queryText);
  const availableKeys = Object.keys(apiKeys).filter(k => !!apiKeys[k as keyof ApiKeys]);
  console.log('Available API keys:', availableKeys);
  
  if (availableKeys.length === 0) {
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
  }
  
  // Create API promises only for those with keys
  const apiPromises = [];
  const apiSources = [];
  
  console.log('=== Creating API Promises ===');
  
  // CRITICAL CHANGE: Prioritize Anthropic for Agent Vera
  // Add Anthropic first to ensure it's used for Agent Vera
  if (apiKeys.anthropic) {
    console.log('Adding Anthropic API call to queue with key:', apiKeys.anthropic.substring(0, 5) + '...');
    apiPromises.push(fetchFromAnthropic(queryText, apiKeys.anthropic));
    apiSources.push('Claude 3 Haiku');
  }
  
  if (apiKeys.anthropicClaude35) {
    console.log('Adding Anthropic Claude 3.5 API call to queue with key:', apiKeys.anthropicClaude35.substring(0, 5) + '...');
    apiPromises.push(fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35));
    apiSources.push('Claude 3.5 Sonnet');
  }
  
  // Add other APIs after Anthropic
  if (apiKeys.openai) {
    console.log('Adding OpenAI API call to queue with key:', apiKeys.openai.substring(0, 5) + '...');
    apiPromises.push(fetchFromOpenAI(queryText, apiKeys.openai));
    apiSources.push('GPT-4o');
  }
  
  if (apiKeys.gemini) {
    console.log('Adding Gemini API call to queue with key:', apiKeys.gemini.substring(0, 5) + '...');
    apiPromises.push(fetchFromGemini(queryText, apiKeys.gemini));
    apiSources.push('Gemini 1.5 Pro');
  }
  
  if (apiKeys.geminiProExperimental) {
    console.log('Adding Gemini Pro Experimental API call to queue with key:', apiKeys.geminiProExperimental.substring(0, 5) + '...');
    apiPromises.push(fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental));
    apiSources.push('Gemini 1.5 Flash');
  }
  
  if (apiKeys.perplexity) {
    console.log('Adding Perplexity API call to queue with key:', apiKeys.perplexity.substring(0, 5) + '...');
    apiPromises.push(fetchFromPerplexity(queryText, apiKeys.perplexity));
    apiSources.push('Perplexity Sonar');
  }
  
  if (apiKeys.deepseek) {
    console.log('Adding DeepSeek API call to queue with key:', apiKeys.deepseek.substring(0, 5) + '...');
    apiPromises.push(fetchFromDeepseek(queryText, apiKeys.deepseek));
    apiSources.push('DeepSeek Coder');
  }
  
  console.log(`Attempting to fetch from ${apiPromises.length} LLMs:`, apiSources.join(', '));
  
  if (apiPromises.length === 0) {
    console.error('No API promises created - no valid API keys found');
    return { 
      allResponses: [], 
      derivedConsensus: "No valid API keys configured. Please add API keys in the settings." 
    };
  }
  
  // Execute all API promises simultaneously
  console.log('=== Executing API Calls ===');
  const apiResults = await Promise.allSettled(apiPromises);
  
  // Debug information about API responses
  apiResults.forEach((result, index) => {
    const source = index < apiSources.length ? apiSources[index] : 'Unknown';
    if (result.status === 'fulfilled') {
      console.log(`API response from ${source} status:`, result.status);
      console.log(`API response from ${source} value:`, result.value ? 'Response received' : 'Null response');
      if (result.value) {
        console.log(`API response from ${source} content preview:`, result.value.content.substring(0, 50) + '...');
      }
    } else {
      console.error(`API response from ${source} failed:`, result.reason);
    }
  });
  
  // Filter successful responses only
  const validResponses = apiResults
    .filter(result => result.status === 'fulfilled' && result.value !== null)
    .map(result => (result as PromiseFulfilledResult<Response>).value);
  
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
  
  if (validResponses.length === 0) {
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
  }
  
  const derivedConsensus = deriveConsensusResponse(validResponses);
  console.log('Derived consensus response:', derivedConsensus.substring(0, 100) + '...');
  console.log('=== Completed fetchResponses ===');
  
  return { allResponses: validResponses, derivedConsensus };
};
