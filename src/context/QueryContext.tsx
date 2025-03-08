
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Response {
  id: string;
  content: string;
  source: string;
  verified: boolean;
  timestamp: number;
  confidence: number;
}

interface QueryContextType {
  query: string | null;
  responses: Response[];
  isLoading: boolean;
  submitQuery: (query: string) => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

// Mock AI sources
const AI_SOURCES = ['GPT-4', 'Claude 3', 'Gemini', 'Llama 3'];

// Fake data for demonstration purposes
const generateMockResponses = (query: string): Response[] => {
  return AI_SOURCES.map((source, index) => {
    // Change the response slightly based on the source
    const content = `The answer to "${query}" based on verified data is that ${
      index % 2 === 0
        ? 'consensus indicates this is accurate according to multiple reliable sources.'
        : 'while there are multiple viewpoints, the predominant evidence suggests this conclusion.'
    }`;
    
    return {
      id: `${Date.now()}-${index}`,
      content,
      source,
      verified: Math.random() > 0.3, // 70% chance of being verified
      timestamp: Date.now(),
      confidence: 0.7 + Math.random() * 0.3, // Random confidence between 0.7 and 1.0
    };
  });
};

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const submitQuery = async (queryText: string) => {
    setQuery(queryText);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResponses = generateMockResponses(queryText);
      setResponses(mockResponses);
      setIsLoading(false);
    }, 3000);
  };
  
  return (
    <QueryContext.Provider value={{ query, responses, isLoading, submitQuery }}>
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
