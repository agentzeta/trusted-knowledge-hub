
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../../types/query';
import { OpenRouterModel } from './types';
import { getApiKey } from './apiKeyUtils';

export async function makeOpenRouterRequest(
  queryText: string,
  model: OpenRouterModel,
  apiKeys: string[],
  modelIndex: number
): Promise<Response | null> {
  try {
    // Get API key for this model using round-robin selection
    const apiKey = getApiKey(apiKeys, modelIndex);
    if (!apiKey) {
      throw new Error(`No valid API key available for model ${model.displayName}`);
    }
    
    // Create unique request ID to prevent caching
    const requestId = `${Date.now()}-${model.id}-${modelIndex}-${Math.random().toString(36).substring(2, 15)}`;
    
    console.log(`Starting request #${modelIndex+1} for model: ${model.displayName} (${model.id}) with API key index ${modelIndex % apiKeys.length}`);
    
    // Make the API call with extensive error handling
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin, // Required by OpenRouter
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: model.id, // Use exact model ID from documentation
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        max_tokens: 1000, // Using 1000 tokens for comprehensive responses
        extra: { requestId } // Add unique ID to prevent caching
      })
    });
    
    // Check status code to handle HTTP errors
    if (!response.ok) {
      // Try to parse error response for details
      let errorDetail = '';
      try {
        const errorJson = await response.json();
        errorDetail = JSON.stringify(errorJson);
        
        // Handle rate limits explicitly (HTTP 429)
        if (response.status === 429) {
          console.error(`RATE LIMIT ERROR for ${model.displayName}: ${errorDetail}`);
          // Request failed due to rate limiting
          return null;
        }
      } catch (e) {
        errorDetail = await response.text();
      }
      
      throw new Error(`HTTP ${response.status} error from ${model.displayName}: ${errorDetail}`);
    }
    
    // Parse the successful response
    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`Invalid response format from ${model.displayName}`);
    }
    
    const content = data.choices[0].message.content;
    console.log(`✅ SUCCESS! Got response from ${model.displayName} (${content.length} chars)`);
    
    // Return properly formatted response
    return {
      id: uuidv4(),
      content: content,
      source: model.displayName,
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };

  } catch (error) {
    console.error(`❌ ERROR fetching from ${model.displayName}:`, error);
    return {
      id: uuidv4(),
      content: `Error fetching from ${model.displayName}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      source: `${model.displayName} (Error)`,
      verified: false,
      timestamp: Date.now(),
      confidence: 0
    };
  }
}
