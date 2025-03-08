
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { 
  ApiKeys, 
  QueryContextType, 
  Response 
} from '../types/query';
import { 
  AI_SOURCES, 
  DEFAULT_API_KEYS, 
  fetchFromOpenAI, 
  fetchFromAnthropic, 
  fetchFromAnthropicClaude35, 
  fetchFromGemini, 
  fetchFromGeminiProExp, 
  fetchFromPerplexity, 
  fetchFromDeepseek, 
  getMockResponse 
} from '../services/modelService';
import { deriveConsensusResponse } from '../utils/consensusUtils';

const STORAGE_KEY = 'ai_consensus_api_keys';

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [consensusResponse, setConsensusResponse] = useState<string | null>(null);
  
  // Load API keys from localStorage on initial render
  useEffect(() => {
    const storedKeys = localStorage.getItem(STORAGE_KEY);
    if (storedKeys) {
      try {
        const parsedKeys = JSON.parse(storedKeys);
        setApiKeys(parsedKeys);
      } catch (error) {
        console.error('Error parsing stored API keys:', error);
      }
    }
  }, []);
  
  const setApiKey = (provider: string, key: string) => {
    const updatedKeys = { ...apiKeys, [provider.toLowerCase()]: key };
    setApiKeys(updatedKeys);
    
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));
    
    toast({
      title: "API Key Saved",
      description: `${provider} API key has been saved and will persist across sessions.`,
      duration: 3000,
    });
  };

  const submitQuery = async (queryText: string) => {
    setQuery(queryText);
    setIsLoading(true);
    setConsensusResponse(null);
    
    try {
      // Collect promises for all API calls
      const apiPromises = [
        fetchFromOpenAI(queryText, apiKeys.openai || ''),
        fetchFromAnthropic(queryText, apiKeys.anthropic || ''),
        fetchFromAnthropicClaude35(queryText, apiKeys.anthropicClaude35 || ''),
        fetchFromGemini(queryText, apiKeys.gemini || ''),
        fetchFromGeminiProExp(queryText, apiKeys.geminiProExperimental || ''),
        fetchFromPerplexity(queryText, apiKeys.perplexity || ''),
        fetchFromDeepseek(queryText, apiKeys.deepseek || ''),
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

// Fix the type re-export with 'export type'
export type { Response };
