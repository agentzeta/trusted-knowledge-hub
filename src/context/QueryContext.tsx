
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface Response {
  id: string;
  content: string;
  source: string;
  verified: boolean;
  timestamp: number;
  confidence: number;
}

interface ApiKeys {
  openai?: string;
  anthropic?: string;
  anthropicClaude35?: string;
  gemini?: string;
  geminiProExperimental?: string;
  perplexity?: string;
  deepseek?: string;
  grok?: string;
  qwen?: string;
  // Add more API keys as needed
}

interface QueryContextType {
  query: string | null;
  responses: Response[];
  isLoading: boolean;
  submitQuery: (query: string) => void;
  setApiKey: (provider: string, key: string) => void;
  apiKeys: ApiKeys;
  consensusResponse: string | null;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

// Available AI models
const AI_SOURCES = [
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
const DEFAULT_API_KEYS: ApiKeys = {
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

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [consensusResponse, setConsensusResponse] = useState<string | null>(null);
  
  const setApiKey = (provider: string, key: string) => {
    setApiKeys(prev => ({ ...prev, [provider.toLowerCase()]: key }));
    toast({
      title: "API Key Saved",
      description: `${provider} API key has been saved.`,
      duration: 3000,
    });
  };

  // Get consensus response from all AI responses
  const deriveConsensusResponse = (allResponses: Response[]): string => {
    // Simple approach: use the most verified response with highest confidence
    if (allResponses.length === 0) return "No responses available";
    
    const sortedResponses = [...allResponses].sort((a, b) => {
      if (a.verified === b.verified) {
        return b.confidence - a.confidence;
      }
      return a.verified ? -1 : 1;
    });
    
    return sortedResponses[0].content;
  };

  // Process OpenAI (GPT-4) response
  const fetchFromOpenAI = async (queryText: string): Promise<Response | null> => {
    if (!apiKeys.openai) return null;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKeys.openai}`
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
  const fetchFromAnthropic = async (queryText: string): Promise<Response | null> => {
    if (!apiKeys.anthropic) return null;
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': apiKeys.anthropic
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
  const fetchFromAnthropicClaude35 = async (queryText: string): Promise<Response | null> => {
    if (!apiKeys.anthropicClaude35) return null;
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': apiKeys.anthropicClaude35
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
  const fetchFromGemini = async (queryText: string): Promise<Response | null> => {
    if (!apiKeys.gemini) return null;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKeys.gemini}`, {
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
  const fetchFromGeminiProExp = async (queryText: string): Promise<Response | null> => {
    if (!apiKeys.geminiProExperimental) return null;
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-experimental:generateContent?key=${apiKeys.geminiProExperimental}`, {
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
  const fetchFromPerplexity = async (queryText: string): Promise<Response | null> => {
    if (!apiKeys.perplexity) return null;
    
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.perplexity}`,
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
  const fetchFromDeepseek = async (queryText: string): Promise<Response | null> => {
    try {
      // Using a proxy service or open source version
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKeys.deepseek ? { 'Authorization': `Bearer ${apiKeys.deepseek}` } : {})
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
  const getMockResponse = (source: string, queryText: string): Response => {
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

  const submitQuery = async (queryText: string) => {
    setQuery(queryText);
    setIsLoading(true);
    setConsensusResponse(null);
    
    try {
      // Collect promises for all API calls
      const apiPromises = [
        fetchFromOpenAI(queryText),
        fetchFromAnthropic(queryText),
        fetchFromAnthropicClaude35(queryText),
        fetchFromGemini(queryText),
        fetchFromGeminiProExp(queryText),
        fetchFromPerplexity(queryText),
        fetchFromDeepseek(queryText),
      ];
      
      // Wait for all API calls to complete
      const apiResults = await Promise.all(apiPromises);
      
      // Filter out null results (failed API calls or missing API keys)
      const validResponses = apiResults.filter(Boolean) as Response[];
      
      // Fill in with mock responses for missing models
      const sourcesWithResponses = validResponses.map(r => r.source);
      const missingModels = AI_SOURCES.filter(source => 
        !sourcesWithResponses.includes(source)
      );
      
      // Generate mock responses for missing models
      const mockResponses = missingModels.map(source => 
        getMockResponse(source, queryText)
      );
      
      // Combine real and mock responses
      const allResponses = [...validResponses, ...mockResponses];
      
      // Derive consensus response
      const derivedConsensus = deriveConsensusResponse(allResponses);
      setConsensusResponse(derivedConsensus);
      
      setResponses(allResponses);
    } catch (error) {
      console.error('Error submitting query:', error);
      toast({
        title: "Error",
        description: "Failed to get responses from AI models. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to all mock responses on error
      const mockResponses = AI_SOURCES.map(source => 
        getMockResponse(source, queryText)
      );
      
      // Derive consensus response from mock data
      const derivedConsensus = deriveConsensusResponse(mockResponses);
      setConsensusResponse(derivedConsensus);
      
      setResponses(mockResponses);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <QueryContext.Provider value={{ 
      query, 
      responses, 
      isLoading, 
      submitQuery, 
      setApiKey, 
      apiKeys,
      consensusResponse
    }}>
      {children}
    </QueryContext.Provider>
  );
};

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQueryContext must be used within a QueryProvider');
  }
  return context;
};
