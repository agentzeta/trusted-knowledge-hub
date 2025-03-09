
import { OPENROUTER_MODEL_IDS } from '../constants';

// Handle API request for a single model
export const handleApiRequest = async (
  queryText: string, 
  apiKey: string, 
  model: { id: string, displayName: string },
  signal?: AbortSignal
) => {
  console.log(`Sending request to OpenRouter model: ${model.displayName}`);
  
  try {
    // Create unique request ID
    const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Make API call
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: model.id,
        messages: [
          { role: 'system', content: 'You are a helpful assistant. Provide accurate, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3,
        max_tokens: 1000,
        extra: { requestId }
      }),
      signal
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status} from ${model.displayName}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error(`Invalid response format from ${model.displayName}`);
    }
    
    return {
      content: data.choices[0].message.content,
      modelId: model.id,
      modelDisplayName: model.displayName
    };
  } catch (error) {
    console.error(`Error in OpenRouter API request for ${model.displayName}:`, error);
    
    // Specifically handle abort errors
    if (error.name === 'AbortError') {
      console.log(`Request to ${model.displayName} was aborted`);
      throw error; // Propagate abort errors
    }
    
    // For other errors, return null to be filtered out later
    return null;
  }
};
