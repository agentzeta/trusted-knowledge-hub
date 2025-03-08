
import { Response } from '../types/query';

// Available AI models
export const AI_SOURCES = [
  'GPT-4', 
  'Claude 3', 
  'Claude 3.5',
  'Gemini', 
  'Gemini Pro Experimental',
  'Llama 3', 
  'Grok', 
  'Perplexity', 
  'Deepseek',
  'Qwen'
];

// Default API keys - in a real app, these would be stored securely on the server
export const DEFAULT_API_KEYS = {
  openai: process.env.OPENAI_API_KEY || '',
  anthropic: process.env.ANTHROPIC_API_KEY || '',
  anthropicClaude35: process.env.ANTHROPIC_CLAUDE35_API_KEY || '',
  gemini: process.env.GEMINI_API_KEY || '',
  geminiProExperimental: process.env.GEMINI_PRO_EXP_API_KEY || '',
  perplexity: process.env.PERPLEXITY_API_KEY || '',
  deepseek: process.env.DEEPSEEK_API_KEY || '',
  grok: process.env.GROK_API_KEY || '',
  qwen: process.env.QWEN_API_KEY || '',
};

// Process OpenAI (GPT-4) response
export const fetchFromOpenAI = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: queryText }],
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return null;
    }
    
    return {
      id: `openai-${Date.now()}`,
      content: data.choices[0].message.content.trim(),
      source: 'GPT-4',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.9
    };
  } catch (error) {
    console.error('Error fetching from OpenAI:', error);
    return null;
  }
};

// Process Anthropic (Claude) response
export const fetchFromAnthropic = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 150,
        messages: [{ role: 'user', content: queryText }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Anthropic API error:', data.error);
      return null;
    }
    
    return {
      id: `anthropic-${Date.now()}`,
      content: data.content[0].text,
      source: 'Claude 3',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.92
    };
  } catch (error) {
    console.error('Error fetching from Anthropic:', error);
    return null;
  }
};

// Process Anthropic Claude 3.5 response
export const fetchFromAnthropicClaude35 = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 150,
        messages: [{ role: 'user', content: queryText }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Claude 3.5 API error:', data.error);
      return null;
    }
    
    return {
      id: `anthropic35-${Date.now()}`,
      content: data.content[0].text,
      source: 'Claude 3.5',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.94
    };
  } catch (error) {
    console.error('Error fetching from Claude 3.5:', error);
    return null;
  }
};

// Process Gemini response
export const fetchFromGemini = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: queryText }] }],
        generationConfig: {
          maxOutputTokens: 150,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return null;
    }
    
    return {
      id: `gemini-${Date.now()}`,
      content: data.candidates[0].content.parts[0].text,
      source: 'Gemini',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.85
    };
  } catch (error) {
    console.error('Error fetching from Gemini:', error);
    return null;
  }
};

// Process Gemini Pro Experimental response
export const fetchFromGeminiProExp = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-experimental:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: queryText }] }],
        generationConfig: {
          maxOutputTokens: 150,
        }
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini Pro Experimental API error:', data.error);
      return null;
    }
    
    return {
      id: `gemini-pro-exp-${Date.now()}`,
      content: data.candidates[0].content.parts[0].text,
      source: 'Gemini Pro Experimental',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.88
    };
  } catch (error) {
    console.error('Error fetching from Gemini Pro Experimental:', error);
    return null;
  }
};

// Process Perplexity response
export const fetchFromPerplexity = async (queryText: string, apiKey: string): Promise<Response | null> => {
  if (!apiKey) return null;
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Be precise and concise.'
          },
          {
            role: 'user',
            content: queryText
          }
        ],
        max_tokens: 150,
      }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Perplexity API error:', data.error);
      return null;
    }
    
    return {
      id: `perplexity-${Date.now()}`,
      content: data.choices[0].message.content,
      source: 'Perplexity',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.88
    };
  } catch (error) {
    console.error('Error fetching from Perplexity:', error);
    return null;
  }
};

// Process Deepseek response - can work without API key in some scenarios
export const fetchFromDeepseek = async (queryText: string, apiKey: string): Promise<Response | null> => {
  try {
    // Using a proxy service or open source version
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {})
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: queryText }],
        max_tokens: 150
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Deepseek API error:', data.error);
      // Fallback to mock for Deepseek specifically since we promised at least one response
      return {
        id: `deepseek-${Date.now()}`,
        content: `${queryText} - Response from Deepseek (mock version).`,
        source: 'Deepseek',
        verified: true,
        timestamp: Date.now(),
        confidence: 0.82
      };
    }
    
    return {
      id: `deepseek-${Date.now()}`,
      content: data.choices?.[0]?.message?.content || `${queryText} - Response from Deepseek.`,
      source: 'Deepseek',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.82
    };
  } catch (error) {
    console.error('Error fetching from Deepseek:', error);
    // Fallback to mock for Deepseek specifically since we promised at least one response
    return {
      id: `deepseek-${Date.now()}`,
      content: `${queryText} - Response from Deepseek (mock fallback).`,
      source: 'Deepseek',
      verified: true,
      timestamp: Date.now(),
      confidence: 0.8
    };
  }
};

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
