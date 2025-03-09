
import { ApiKeys } from '../../types/query';
import { 
  fetchFromOpenAI, 
  fetchFromAnthropic, 
  fetchFromAnthropicClaude35, 
  fetchFromGemini, 
  fetchFromGeminiProExp, 
  fetchFromPerplexity, 
  fetchFromDeepseek,
  fetchFromMultipleOpenRouterModels
} from '../modelService';

/**
 * Creates API promises based on available API keys
 */
export const createApiPromises = (queryText: string, apiKeys: ApiKeys) => {
  console.log('=== Creating API Promises ===');
  
  const apiPromises = [];
  const apiSources = [];
  
  // Create promises for each API with a key
  if (apiKeys.anthropic) {
    console.log('Adding Anthropic (Claude 3 Haiku) to request queue');
    apiPromises.push(fetchFromAnthropic(queryText, apiKeys.anthropic));
    apiSources.push('Claude 3 Haiku');
    
    // Use the same anthropic key for Claude 3.5 Sonnet
    console.log('Adding Anthropic (Claude 3.5 Sonnet) to request queue with same API key');
    apiPromises.push(fetchFromAnthropicClaude35(queryText, apiKeys.anthropic));
    apiSources.push('Claude 3.5 Sonnet');
  } else if (apiKeys.anthropicClaude35) {
    // Backward compatibility - use specific Claude 3.5 key if provided
    console.log('Adding Anthropic (Claude 3.5 Sonnet) to request queue with specific API key');
    apiPromises.push(fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35));
    apiSources.push('Claude 3.5 Sonnet');
  } else {
    console.log('Skipping Anthropic models - No API key provided');
  }
  
  if (apiKeys.openai) {
    console.log('Adding OpenAI (GPT-4o) to request queue');
    apiPromises.push(fetchFromOpenAI(queryText, apiKeys.openai));
    apiSources.push('GPT-4o');
  } else {
    console.log('Skipping OpenAI (GPT-4o) - No API key provided');
  }
  
  if (apiKeys.gemini) {
    console.log('Adding Gemini (1.5 Pro) to request queue');
    apiPromises.push(fetchFromGemini(queryText, apiKeys.gemini));
    apiSources.push('Gemini 1.5 Pro');
  } else {
    console.log('Skipping Gemini (1.5 Pro) - No API key provided');
  }
  
  if (apiKeys.geminiProExperimental) {
    console.log('Adding Gemini (1.5 Flash) to request queue');
    apiPromises.push(fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental));
    apiSources.push('Gemini 1.5 Flash');
  } else {
    console.log('Skipping Gemini (1.5 Flash) - No API key provided');
  }
  
  if (apiKeys.perplexity) {
    console.log('Adding Perplexity (Sonar) to request queue');
    apiPromises.push(fetchFromPerplexity(queryText, apiKeys.perplexity));
    apiSources.push('Perplexity Sonar');
  } else {
    console.log('Skipping Perplexity (Sonar) - No API key provided');
  }
  
  if (apiKeys.deepseek) {
    console.log('Adding DeepSeek (Coder) to request queue');
    apiPromises.push(fetchFromDeepseek(queryText, apiKeys.deepseek));
    apiSources.push('DeepSeek Coder');
  } else {
    console.log('Skipping DeepSeek (Coder) - No API key provided');
  }
  
  // Add OpenRouter with better error handling
  if (apiKeys.openrouter) {
    console.log('🔥 Adding OpenRouter multi-model fetching to queue');
    // This will make separate API requests for each model and return an array of responses
    const openRouterPromise = fetchFromMultipleOpenRouterModels(queryText, apiKeys.openrouter)
      .catch(error => {
        console.error('OpenRouter multi-model fetch failed:', error);
        // Return empty array on error to prevent blocking other models
        return [];
      });
    
    apiPromises.push(openRouterPromise);
    apiSources.push('OpenRouter Models');
  } else {
    console.log('Skipping OpenRouter models - No API key provided');
  }
  
  console.log(`Created ${apiPromises.length} API promises with sources:`, apiSources.join(', '));
  
  return { apiPromises, apiSources };
};
