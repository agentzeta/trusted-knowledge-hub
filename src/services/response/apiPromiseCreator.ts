
import { v4 as uuidv4 } from 'uuid';
import { ApiKeys, Response } from '../../types/query';
import {
  AI_SOURCES,
  fetchFromOpenAI,
  fetchFromAnthropic,
  fetchFromAnthropicClaude35,
  fetchFromGemini,
  fetchFromGeminiProExp,
  fetchFromPerplexity,
  fetchFromDeepseek, // Correct casing
  fetchFromOpenRouter,
  fetchFromMultipleOpenRouterModels,
  getMockResponse
} from '../modelService';

/**
 * Create API promises for all configured models
 */
export const createApiPromises = (queryText: string, apiKeys: ApiKeys) => {
  const timestamp = Date.now();
  const apiPromises: Promise<Response | Response[] | null>[] = [];
  const apiSources: string[] = [];
  
  console.log('Creating API promises for query:', queryText.substring(0, 30) + '...');
  
  // Wrap each API call in a try/catch to prevent one failure from blocking all responses
  // OpenAI Models
  if (apiKeys.openai) {
    try {
      console.log('Adding OpenAI API call');
      apiPromises.push(fetchFromOpenAI(queryText, apiKeys.openai).catch(error => {
        console.error('Error in OpenAI API call:', error);
        return null;
      }));
      apiSources.push(AI_SOURCES.OPENAI);
    } catch (error) {
      console.error('Error setting up OpenAI API call:', error);
    }
  }
  
  // Claude 3 Opus
  if (apiKeys.anthropic) {
    try {
      console.log('Adding Claude API call');
      apiPromises.push(fetchFromAnthropic(queryText, apiKeys.anthropic).catch(error => {
        console.error('Error in Claude API call:', error);
        return null;
      }));
      apiSources.push(AI_SOURCES.ANTHROPIC);
    } catch (error) {
      console.error('Error setting up Claude API call:', error);
    }
  }
  
  // Claude 3.5 Sonnet
  if (apiKeys.anthropicClaude35) {
    try {
      console.log('Adding Claude 3.5 API call');
      apiPromises.push(fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35).catch(error => {
        console.error('Error in Claude 3.5 API call:', error);
        return null;
      }));
      apiSources.push(AI_SOURCES.ANTHROPIC_CLAUDE35);
    } catch (error) {
      console.error('Error setting up Claude 3.5 API call:', error);
    }
  }
  
  // Gemini 1.5 Pro
  if (apiKeys.gemini) {
    try {
      console.log('Adding Gemini API call');
      apiPromises.push(fetchFromGemini(queryText, apiKeys.gemini).catch(error => {
        console.error('Error in Gemini API call:', error);
        return null;
      }));
      apiSources.push(AI_SOURCES.GEMINI);
    } catch (error) {
      console.error('Error setting up Gemini API call:', error);
    }
  }
  
  // Gemini Pro Experimental
  if (apiKeys.geminiProExperimental) {
    try {
      console.log('Adding Gemini Pro Experimental API call');
      apiPromises.push(fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental).catch(error => {
        console.error('Error in Gemini Pro Experimental API call:', error);
        return null;
      }));
      apiSources.push(AI_SOURCES.GEMINI_PRO_EXP);
    } catch (error) {
      console.error('Error setting up Gemini Pro Experimental API call:', error);
    }
  }
  
  // Perplexity
  if (apiKeys.perplexity) {
    try {
      console.log('Adding Perplexity API call');
      apiPromises.push(fetchFromPerplexity(queryText, apiKeys.perplexity).catch(error => {
        console.error('Error in Perplexity API call:', error);
        return null;
      }));
      apiSources.push(AI_SOURCES.PERPLEXITY);
    } catch (error) {
      console.error('Error setting up Perplexity API call:', error);
    }
  }
  
  // DeepSeek
  if (apiKeys.deepseek) {
    try {
      console.log('Adding DeepSeek API call');
      apiPromises.push(fetchFromDeepseek(queryText, apiKeys.deepseek).catch(error => {
        console.error('Error in DeepSeek API call:', error);
        return null;
      }));
      apiSources.push(AI_SOURCES.DEEPSEEK);
    } catch (error) {
      console.error('Error setting up DeepSeek API call:', error);
    }
  }
  
  // OpenRouter - for multiple models in one call
  if (apiKeys.openrouter) {
    try {
      console.log('Adding OpenRouter multi-model API call');
      // Use the proper function
      const openRouterPromise = fetchFromMultipleOpenRouterModels(queryText, apiKeys.openrouter).catch(error => {
        console.error('Error in OpenRouter multi-model API call:', error);
        // Return empty array instead of null to maintain type consistency
        return [] as Response[];
      });
      apiPromises.push(openRouterPromise);
      apiSources.push(AI_SOURCES.OPENROUTER_MULTI);
    } catch (error) {
      console.error('Error setting up OpenRouter multi-model API call:', error);
    }
  }
  
  // If no API keys are available, provide a mock response
  if (apiPromises.length === 0) {
    console.log('No API keys available, adding mock response');
    const mockResponse: Promise<Response> = Promise.resolve(getMockResponse('Mock Response', queryText));
    apiPromises.push(mockResponse);
    apiSources.push('Mock Response');
  }
  
  return { apiPromises, apiSources };
};
