
import { Response } from '../../types/query';

// Fallback mock responses for models without API integration
export const getMockResponse = (source: string, queryText: string): Response => {
  const content = `${queryText} - This is a mock response from ${source} because no API key was provided or the API is not yet integrated.`;
  return {
    id: `${source.toLowerCase()}-${Date.now()}`,
    content,
    source,
    verified: Math.random() > 0.3,
    timestamp: Date.now(),
    confidence: 0.7 + Math.random() * 0.3,
  };
};
