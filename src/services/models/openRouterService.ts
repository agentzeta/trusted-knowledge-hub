
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

// New function to fetch from multiple models in parallel
export const fetchFromMultipleOpenRouterModels = async (
  queryText: string,
  apiKey: string
): Promise<Response[]> => {
  console.log('Fetching from multiple OpenRouter models');
  
  // Define a list of interesting and diverse models to query
  const models = [
    { name: 'anthropic/claude-3-opus:20240229', label: 'Claude 3.7 Opus' },
    { name: 'anthropic/claude-3-sonnet:20240229', label: 'Claude 3.5 Sonnet' },
    { name: 'google/gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
    { name: 'mistralai/mistral-large', label: 'Mistral Large' },
    { name: 'meta-llama/llama-3-70b-instruct', label: 'Llama 3 70B' },
    { name: 'deepseek-ai/deepseek-v2', label: 'DeepSeek V2' },
    { name: 'cohere/command-r-plus', label: 'Cohere Command-R+' },
    { name: 'perplexity/sonar-small-online', label: 'Perplexity Sonar' }
  ];
  
  // Create an array of promises, each fetching from a different model
  const promises = models.map(model => 
    fetchFromOpenRouter(queryText, apiKey, model.name)
      .catch(error => {
        console.error(`Error fetching from OpenRouter model ${model.label}:`, error);
        return null;
      })
  );
  
  // Wait for all promises to resolve
  const results = await Promise.allSettled(promises);
  
  // Filter out failed requests and return successful responses
  return results
    .filter((result): result is PromiseFulfilledResult<Response> => 
      result.status === 'fulfilled' && result.value !== null
    )
    .map(result => result.value);
};
