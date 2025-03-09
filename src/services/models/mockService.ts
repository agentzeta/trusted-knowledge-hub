
import { Response } from '../../types/query';

// Generate a mock response for testing purposes
export const getMockResponse = (source: string, queryText: string): Response => {
  const id = `mock-${source.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
  const timestamp = Date.now();
  
  // Create distinct but plausible responses for each model
  let content = '';
  let confidence = 0.8;
  
  switch (source) {
    case 'GPT-4o':
      content = `Based on current information, ${queryText.trim().replace(/\?$/, '')}. The evidence suggests this is accurate, though interpretations may vary depending on specific context.`;
      confidence = 0.92;
      break;
    case 'Claude 3 Haiku':
      content = `Regarding "${queryText.trim()}" - the answer is multi-faceted. Key points to consider include context, recency of information, and nuance in interpretation.`;
      confidence = 0.89;
      break;
    case 'Claude 3.5 Sonnet':
      content = `To address your question about ${queryText.trim().replace(/\?$/, '')}, I can provide a comprehensive answer based on the latest available information. This is a nuanced topic that requires careful consideration.`;
      confidence = 0.94;
      break;
    case 'Gemini 1.5 Pro':
      content = `Analyzing your query "${queryText.trim()}" - here's what I found: this is a complex subject with multiple perspectives. The most accurate view based on current data suggests a balanced approach.`;
      confidence = 0.88;
      break;
    case 'Gemini 1.5 Flash':
      content = `In response to "${queryText.trim()}" - current information indicates the following key points are most relevant. Consider these factors for a complete understanding.`;
      confidence = 0.86;
      break;
    case 'Perplexity Sonar':
      content = `For "${queryText.trim()}" - multiple sources suggest this perspective is generally accurate, though specifics may vary by context. Consider reviewing specialized sources for more detail.`;
      confidence = 0.91;
      break;
    case 'DeepSeek Coder':
      content = `Regarding "${queryText.trim()}" - analysis suggests the following conclusion is most supported by available evidence. This represents current understanding but may evolve with new information.`;
      confidence = 0.85;
      break;
    default:
      content = `Here's what I know about "${queryText.trim()}": The information available supports a tentative conclusion, though more context would be helpful for a more precise answer.`;
      confidence = 0.82;
  }
  
  return {
    id,
    content,
    source,
    verified: Math.random() > 0.2, // 80% chance of being verified for mock data
    timestamp,
    confidence
  };
};
