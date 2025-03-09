
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../../types/query';
import { processBatchedRequests } from './batchProcessor';
import { OPENROUTER_MODELS } from './modelDefinitions';

// Main export: fetch from multiple OpenRouter models
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKeyString: string
): Promise<Response[]> => {
  console.log('=== FETCHING FROM MULTIPLE OPENROUTER MODELS ===');
  
  if (!apiKeyString) {
    console.error('No OpenRouter API key provided');
    return [];
  }
  
  return processBatchedRequests(queryText, apiKeyString);
};

// For backward compatibility: fetch from a single OpenRouter model
export const fetchFromOpenRouter = async (
  queryText: string, 
  apiKey: string, 
  modelName: string = 'anthropic/claude-3-opus:20240229'
): Promise<Response> => {
  // Find model info or use default
  const modelInfo = OPENROUTER_MODELS.find(m => m.id === modelName) || 
    { id: modelName, displayName: modelName.split('/').pop() || 'OpenRouter Model' };
  
  try {
    console.log(`Fetching from single OpenRouter model: ${modelInfo.displayName}`);
    
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: modelInfo.id,
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        extra: { requestId }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format');
    }
    
    return {
      id: uuidv4(),
      content: data.choices[0].message.content,
      source: modelInfo.displayName,
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };
  } catch (error) {
    console.error(`Error fetching from ${modelInfo.displayName}:`, error);
    throw error;
  }
};
