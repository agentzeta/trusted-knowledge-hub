
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
  
  // Make sure OpenRouter is processed LAST since it returns multiple responses
  // This ensures it doesn't get overshadowed by other API results
  if (apiKeys.openrouter) {
    console.log('Adding OpenRouter multimodel fetching to request queue (LAST)');
    
    // Add it directly to the apiPromises array but correctly label it for error handling
    apiPromises.push(fetchFromMultipleOpenRouterModels(queryText, apiKeys.openrouter));
    apiSources.push('OpenRouter Models');
    
    console.log('OpenRouter multimodel fetching has been added as the last API call');
  } else {
    console.log('Skipping OpenRouter models - No API key provided');
  }
  
  // Add support for Llama models
  if (apiKeys.llama) {
    console.log('Using Llama API key for all Llama models');
    console.log('Llama API key is available for use with Llama models');
  }
  
  // Handle ElevenLabs key for voice synthesis
  if (apiKeys.elevenlabs) {
    console.log('ElevenLabs API key is available for voice synthesis');
    try {
      sessionStorage.setItem('elevenLabsApiKey', apiKeys.elevenlabs);
      console.log('ElevenLabs API key stored in session storage for voice synthesis');
    } catch (e) {
      console.error('Failed to store ElevenLabs API key in session storage:', e);
    }
  }
  
  console.log(`Created ${apiPromises.length} API promises with sources:`, apiSources.join(', '));
  
  return { apiPromises, apiSources };
};
