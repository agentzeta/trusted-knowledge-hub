
import * as modelService from '../modelService';
import { v4 as uuidv4 } from 'uuid';
import { ApiKeys, Response } from '../../types/query';

/**
 * Creates API promises for each configured model based on API keys
 * Returns array of promises and their corresponding source names
 */
export const createApiPromises = (queryText: string, apiKeys: ApiKeys, signal?: AbortSignal) => {
  const apiPromises: Promise<Response | Response[] | null>[] = [];
  const apiSources: string[] = [];

  // Helper to add a promise to the arrays
  const addPromise = (promise: Promise<Response | Response[] | null>, source: string) => {
    apiPromises.push(promise);
    apiSources.push(source);
  };

  // Function to create abortable fetch if signal is provided
  const createAbortablePromise = <T>(promise: Promise<T>): Promise<T> => {
    if (!signal) return promise;
    
    return new Promise((resolve, reject) => {
      // If signal is already aborted, reject immediately
      if (signal.aborted) {
        reject(new DOMException('Operation aborted', 'AbortError'));
        return;
      }
      
      // Handle abort events
      const abortHandler = () => {
        reject(new DOMException('Operation aborted', 'AbortError'));
      };
      
      signal.addEventListener('abort', abortHandler);
      
      promise
        .then(result => {
          signal.removeEventListener('abort', abortHandler);
          resolve(result);
        })
        .catch(error => {
          signal.removeEventListener('abort', abortHandler);
          reject(error);
        });
    });
  };

  // OpenAI API
  if (apiKeys.openai) {
    try {
      addPromise(
        createAbortablePromise(modelService.fetchFromOpenAI(queryText, apiKeys.openai)),
        'OpenAI GPT-4'
      );
    } catch (error) {
      console.error('Error creating OpenAI promise:', error);
    }
  }

  // Anthropic Claude API (both keys for backward compatibility)
  const anthropicKey = apiKeys.anthropic || apiKeys.anthropicClaude35;
  if (anthropicKey) {
    try {
      // Claude 3.5 Sonnet
      addPromise(
        createAbortablePromise(modelService.fetchFromClaude35(queryText, anthropicKey)),
        'Claude 3.5 Sonnet'
      );
      
      // Claude 3.7 Opus if available
      try {
        addPromise(
          createAbortablePromise(modelService.fetchFromClaude37(queryText, anthropicKey)),
          'Claude 3.7 Opus'
        );
      } catch (error) {
        console.error('Error creating Claude 3.7 Opus promise:', error);
      }
    } catch (error) {
      console.error('Error creating Anthropic Claude promise:', error);
    }
  }

  // Google Gemini API
  if (apiKeys.gemini) {
    try {
      addPromise(
        createAbortablePromise(modelService.fetchFromGemini(queryText, apiKeys.gemini)),
        'Gemini 1.5 Pro'
      );
    } catch (error) {
      console.error('Error creating Gemini promise:', error);
    }
  }

  // Google Gemini Pro Experimental API
  if (apiKeys.geminiProExperimental) {
    try {
      addPromise(
        createAbortablePromise(modelService.fetchFromGeminiProExp(queryText)),
        'Gemini 1.5 Pro Experimental'
      );
    } catch (error) {
      console.error('Error creating Gemini Pro Experimental promise:', error);
    }
  }

  // Perplexity API
  if (apiKeys.perplexity) {
    try {
      addPromise(
        createAbortablePromise(modelService.fetchFromPerplexity(queryText, apiKeys.perplexity)),
        'Perplexity Sonar'
      );
    } catch (error) {
      console.error('Error creating Perplexity promise:', error);
    }
  }

  // DeepSeek API
  if (apiKeys.deepseek) {
    try {
      addPromise(
        createAbortablePromise(modelService.fetchFromDeepSeek(queryText, apiKeys.deepseek)),
        'DeepSeek V2'
      );
    } catch (error) {
      console.error('Error creating DeepSeek promise:', error);
    }
  }

  // OpenRouter APIs for other models (using round-robin key assignment)
  if (apiKeys.openrouter) {
    try {
      addPromise(
        createAbortablePromise(modelService.fetchFromOpenRouter(queryText, apiKeys.openrouter)),
        'OpenRouter'
      );
    } catch (error) {
      console.error('Error creating OpenRouter promises:', error);
    }
  }

  // Add development/debug Mock API (response is generated locally)
  // Don't include in production but useful for testing
  if (process.env.NODE_ENV === 'development') {
    try {
      addPromise(
        createAbortablePromise(modelService.getMockResponse('Debug Model', queryText)),
        'Mock/Debug Model'
      );
    } catch (error) {
      console.error('Error creating mock/debug promise:', error);
    }
  }

  return { apiPromises, apiSources };
};
