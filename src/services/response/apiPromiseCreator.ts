
import { v4 as uuidv4 } from 'uuid';
import { ApiKeys } from '../../types/query';
import * as modelService from '../modelService';

/**
 * Create an array of API promises based on available API keys
 */
export const createApiPromises = (queryText: string, apiKeys: ApiKeys, signal?: AbortSignal) => {
  console.log('Creating API promises based on available API keys');
  const apiPromises = [];
  const apiSources = [];

  // Attempt to fetch from OpenAI if API key is available
  if (apiKeys.openai) {
    try {
      console.log('Adding OpenAI GPT-4o to API calls');
      apiPromises.push(modelService.fetchFromOpenAI(queryText, apiKeys.openai, signal));
      apiSources.push('GPT-4o');
    } catch (error) {
      console.error('Error setting up OpenAI fetch:', error);
    }
  }

  // Attempt to fetch from Anthropic Claude if API key is available
  if (apiKeys.anthropic) {
    try {
      console.log('Adding Anthropic Claude Haiku to API calls');
      apiPromises.push(modelService.fetchFromAnthropic(queryText, apiKeys.anthropic, signal));
      apiSources.push('Claude 3 Haiku');
    } catch (error) {
      console.error('Error setting up Anthropic fetch:', error);
    }
  }

  // Attempt to fetch from Anthropic Claude 3.5 Sonnet if API key is available
  if (apiKeys.anthropicClaude35) {
    try {
      console.log('Adding Anthropic Claude 3.5 Sonnet to API calls');
      apiPromises.push(modelService.fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35, signal));
      apiSources.push('Claude 3.5 Sonnet');
    } catch (error) {
      console.error('Error setting up Anthropic Claude 3.5 fetch:', error);
    }
  }

  // Attempt to fetch from Google Gemini Pro if API key is available
  if (apiKeys.gemini) {
    try {
      console.log('Adding Google Gemini 1.5 Pro to API calls');
      apiPromises.push(modelService.fetchFromGoogle(queryText, apiKeys.gemini, signal));
      apiSources.push('Gemini 1.5 Pro');
    } catch (error) {
      console.error('Error setting up Google fetch:', error);
    }
  }

  // Attempt to fetch from Google Gemini Flash if API key is available
  if (apiKeys.geminiProExperimental) {
    try {
      console.log('Adding Google Gemini 1.5 Flash to API calls');
      apiPromises.push(modelService.fetchFromGoogleExperimental(queryText, apiKeys.geminiProExperimental, signal));
      apiSources.push('Gemini 1.5 Flash');
    } catch (error) {
      console.error('Error setting up Google Experimental fetch:', error);
    }
  }

  // Attempt to fetch from Perplexity if API key is available
  if (apiKeys.perplexity) {
    try {
      console.log('Adding Perplexity Sonar to API calls');
      apiPromises.push(modelService.fetchFromPerplexity(queryText, apiKeys.perplexity, signal));
      apiSources.push('Perplexity Sonar');
    } catch (error) {
      console.error('Error setting up Perplexity fetch:', error);
    }
  }

  // Attempt to fetch from DeepSeek if API key is available
  if (apiKeys.deepseek) {
    try {
      console.log('Adding DeepSeek Coder to API calls');
      apiPromises.push(modelService.fetchFromDeepSeek(queryText, apiKeys.deepseek, signal));
      apiSources.push('DeepSeek Coder');
    } catch (error) {
      console.error('Error setting up DeepSeek fetch:', error);
    }
  }

  // Attempt to fetch from Grok if API key is available
  if (apiKeys.grok) {
    try {
      console.log('Adding Grok-1.5 to API calls');
      apiPromises.push(modelService.fetchFromGrok(queryText, apiKeys.grok, signal));
      apiSources.push('Grok-1.5');
    } catch (error) {
      console.error('Error setting up Grok fetch:', error);
    }
  }

  // Attempt to fetch from Qwen if API key is available  
  if (apiKeys.qwen) {
    try {
      console.log('Adding Qwen2 72B to API calls');
      apiPromises.push(modelService.fetchFromQwen(queryText, apiKeys.qwen, signal));
      apiSources.push('Qwen2 72B');
    } catch (error) {
      console.error('Error setting up Qwen fetch:', error);
    }
  }

  // Attempt to fetch from OpenRouter if API key is available
  if (apiKeys.openrouter) {
    try {
      console.log('Adding OpenRouter models to API calls');
      apiPromises.push(modelService.fetchFromMultipleOpenRouterModels(queryText, apiKeys.openrouter, signal));
      apiSources.push('OpenRouter');
    } catch (error) {
      console.error('Error setting up OpenRouter fetch:', error);
    }
  }

  // Attempt to fetch from Meta's Llama if API key is available
  if (apiKeys.llama) {
    try {
      console.log('Adding Llama models to API calls');
      apiPromises.push(modelService.fetchFromLlama(queryText, apiKeys.llama, signal));
      apiSources.push('Llama 3 8B');
    } catch (error) {
      console.error('Error setting up Llama fetch:', error);
    }
  }

  // Create a mock response if in development mode or API keys are missing
  if (apiPromises.length === 0 || process.env.NODE_ENV === 'development') {
    try {
      console.log('Adding mock response to API calls for development testing');
      apiPromises.push(modelService.fetchMockResponse(queryText));
      apiSources.push('Mock Service');
    } catch (error) {
      console.error('Error setting up mock fetch:', error);
    }
  }

  console.log(`Created ${apiPromises.length} API promises`);
  
  return { apiPromises, apiSources };
};
