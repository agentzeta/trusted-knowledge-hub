
import { ApiKeys } from '../../types/query';
import { 
  fetchFromOpenAI, 
  fetchFromAnthropic, 
  fetchFromAnthropicClaude35, 
  fetchFromGemini, 
  fetchFromGeminiProExp, 
  fetchFromPerplexity, 
  fetchFromDeepseek
} from '../modelService';
import { fetchFromMultipleOpenRouterModels } from '../models/openRouter';

/**
 * Creates API promises based on available API keys with improved error handling
 */
export const createApiPromises = (queryText: string, apiKeys: ApiKeys) => {
  console.log('=== Creating API Promises with Improved Error Handling ===');
  
  const apiPromises = [];
  const apiSources = [];
  
  // Create promises for each API with a key
  if (apiKeys.anthropic) {
    console.log('Adding Anthropic (Claude 3 Haiku) to request queue');
    apiPromises.push(
      // Wrap in Promise.resolve().catch to ensure errors don't break the whole process
      Promise.resolve(fetchFromAnthropic(queryText, apiKeys.anthropic))
        .catch(error => {
          console.error('Error fetching from Anthropic (Claude 3 Haiku):', error);
          return null; // Return null to be filtered out later
        })
    );
    apiSources.push('Claude 3 Haiku');
    
    // Use the same anthropic key for Claude 3.5 Sonnet
    console.log('Adding Anthropic (Claude 3.5 Sonnet) to request queue with same API key');
    apiPromises.push(
      Promise.resolve(fetchFromAnthropicClaude35(queryText, apiKeys.anthropic))
        .catch(error => {
          console.error('Error fetching from Anthropic (Claude 3.5 Sonnet):', error);
          return null;
        })
    );
    apiSources.push('Claude 3.5 Sonnet');
  } else if (apiKeys.anthropicClaude35) {
    // Backward compatibility - use specific Claude 3.5 key if provided
    console.log('Adding Anthropic (Claude 3.5 Sonnet) to request queue with specific API key');
    apiPromises.push(
      Promise.resolve(fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35))
        .catch(error => {
          console.error('Error fetching from Anthropic (Claude 3.5 Sonnet):', error);
          return null;
        })
    );
    apiSources.push('Claude 3.5 Sonnet');
  } else {
    console.log('Skipping Anthropic models - No API key provided');
  }
  
  if (apiKeys.openai) {
    console.log('Adding OpenAI (GPT-4o) to request queue');
    apiPromises.push(
      Promise.resolve(fetchFromOpenAI(queryText, apiKeys.openai))
        .catch(error => {
          console.error('Error fetching from OpenAI (GPT-4o):', error);
          return null;
        })
    );
    apiSources.push('GPT-4o');
  } else {
    console.log('Skipping OpenAI (GPT-4o) - No API key provided');
  }
  
  if (apiKeys.gemini) {
    console.log('Adding Gemini (1.5 Pro) to request queue');
    apiPromises.push(
      Promise.resolve(fetchFromGemini(queryText, apiKeys.gemini))
        .catch(error => {
          console.error('Error fetching from Gemini (1.5 Pro):', error);
          return null;
        })
    );
    apiSources.push('Gemini 1.5 Pro');
  } else {
    console.log('Skipping Gemini (1.5 Pro) - No API key provided');
  }
  
  if (apiKeys.geminiProExperimental) {
    console.log('Adding Gemini (1.5 Flash) to request queue');
    apiPromises.push(
      Promise.resolve(fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental))
        .catch(error => {
          console.error('Error fetching from Gemini (1.5 Flash):', error);
          return null;
        })
    );
    apiSources.push('Gemini 1.5 Flash');
  } else {
    console.log('Skipping Gemini (1.5 Flash) - No API key provided');
  }
  
  if (apiKeys.perplexity) {
    console.log('Adding Perplexity (Sonar) to request queue');
    apiPromises.push(
      Promise.resolve(fetchFromPerplexity(queryText, apiKeys.perplexity))
        .catch(error => {
          console.error('Error fetching from Perplexity (Sonar):', error);
          return null;
        })
    );
    apiSources.push('Perplexity Sonar');
  } else {
    console.log('Skipping Perplexity (Sonar) - No API key provided');
  }
  
  if (apiKeys.deepseek) {
    console.log('Adding DeepSeek (Coder) to request queue');
    apiPromises.push(
      Promise.resolve(fetchFromDeepseek(queryText, apiKeys.deepseek))
        .catch(error => {
          console.error('Error fetching from DeepSeek (Coder):', error);
          return null;
        })
    );
    apiSources.push('DeepSeek Coder');
  } else {
    console.log('Skipping DeepSeek (Coder) - No API key provided');
  }
  
  // Handle OpenRouter with updated import
  if (apiKeys.openrouter) {
    console.log('Adding OpenRouter multi-model fetching to request queue');
    
    // Return the promise directly without wrapping in Promise.resolve
    // The fetchFromMultipleOpenRouterModels function already has internal error handling
    const openRouterPromise = fetchFromMultipleOpenRouterModels(queryText, apiKeys.openrouter)
      .catch(error => {
        console.error('Uncaught error in OpenRouter multi-model fetch:', error);
        return []; // Return empty array on error
      });
    
    apiPromises.push(openRouterPromise);
    apiSources.push('OpenRouter Models');
  } else {
    console.log('Skipping OpenRouter models - No API key provided');
  }
  
  console.log(`Created ${apiPromises.length} API promises with sources:`, apiSources.join(', '));
  
  return { apiPromises, apiSources };
};
