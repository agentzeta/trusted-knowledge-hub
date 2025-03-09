
import { v4 as uuidv4 } from 'uuid';
import { Response } from '../../types/query';

export const fetchFromOpenRouter = async (
  queryText: string, 
  apiKey: string, 
  modelName: string = 'anthropic/claude-3-opus:20240229'
): Promise<Response> => {
  console.log('Fetching from OpenRouter:', modelName);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API Response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    const content = data.choices[0].message.content;
    
    // Extract model name from the response or use the provided model name
    // Format: "provider/model-name"
    const modelUsed = data.model.split('/').pop() || modelName;
    
    return {
      id: uuidv4(),
      content,
      source: `OpenRouter/${modelUsed}`,
      verified: false,
      timestamp: Date.now(),
      confidence: 0.7
    };
  } catch (error) {
    console.error('Error fetching from OpenRouter:', error);
    throw error;
  }
};

// Updated function to fetch from multiple models individually instead of in a batch
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKey: string
): Promise<Response[]> => {
  console.log('Fetching from multiple OpenRouter models individually');
  
  // Define models with more specific display names
  const models = [
    { name: 'anthropic/claude-3-opus:20240229', displayName: 'Claude 3.7 Opus' },
    { name: 'anthropic/claude-3-sonnet:20240229', displayName: 'Claude 3.5 Sonnet' },
    { name: 'google/gemini-1.5-pro', displayName: 'Gemini 1.5 Pro (OpenRouter)' },
    { name: 'mistralai/mistral-large', displayName: 'Mistral Large' },
    { name: 'meta-llama/llama-3-70b-instruct', displayName: 'Llama 3 70B' },
    { name: 'deepseek-ai/deepseek-v2', displayName: 'DeepSeek V2' },
    { name: 'cohere/command-r-plus', displayName: 'Cohere Command-R+' },
    { name: 'perplexity/sonar-small-online', displayName: 'Perplexity Sonar' }
  ];
  
  console.log(`Making individual requests to ${models.length} OpenRouter models`);
  
  // Make individual requests for each model to ensure we get distinct responses
  const responses: Response[] = [];
  
  // Create an array of promises for all the API calls
  const promises = models.map(model => {
    return fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Agent Veritas Consensus App'
      },
      body: JSON.stringify({
        model: model.name,
        messages: [
          { role: 'system', content: 'You are a helpful assistant providing factual, concise information.' },
          { role: 'user', content: queryText }
        ],
        temperature: 0.3
      })
    })
    .then(async response => {
      if (!response.ok) {
        console.error(`Error from ${model.displayName}: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error(`Invalid response format from ${model.displayName}`);
        return null;
      }
      
      console.log(`✅ Success: Received response from ${model.displayName}`);
      
      return {
        id: uuidv4(),
        content: data.choices[0].message.content,
        source: model.displayName,
        verified: false,
        timestamp: Date.now(),
        confidence: 0.7
      };
    })
    .catch(error => {
      console.error(`Error fetching from ${model.displayName}:`, error);
      return null;
    });
  });
  
  // Wait for all promises to settle
  const results = await Promise.all(promises);
  
  // Filter out nulls (failed requests)
  const validResponses = results.filter(response => response !== null) as Response[];
  
  console.log(`Successfully received ${validResponses.length} responses from OpenRouter models`);
  
  return validResponses;
};
