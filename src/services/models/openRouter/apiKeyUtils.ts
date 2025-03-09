
// Helper function to parse API keys from a string and validate them
export function parseApiKeys(apiKeyString: string): string[] {
  if (!apiKeyString) return [];
  
  const keys = apiKeyString.split(',').map(k => k.trim()).filter(k => k.length > 0);
  console.log(`Parsed ${keys.length} OpenRouter API keys for round-robin assignment`);
  return keys;
}

// Get API key using round-robin selection with detailed logging
export function getApiKey(apiKeys: string[], modelIndex: number): string {
  if (!apiKeys || apiKeys.length === 0) return '';
  
  const apiKeyIndex = modelIndex % apiKeys.length;
  const apiKey = apiKeys[apiKeyIndex];
  
  console.log(`Using OpenRouter API key index ${apiKeyIndex} (of ${apiKeys.length}) for model index ${modelIndex}`);
  
  // Log partial key (first 8 chars) for debugging
  if (apiKey) {
    console.log(`Selected API key: ${apiKey.substring(0, 8)}...`);
  } else {
    console.error('Invalid API key selected');
  }
  
  return apiKey;
}

// Create a delay function for rate limiting 
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
