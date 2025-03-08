
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ApiKeys, QueryContextType, Response } from '../types/query';
import { DEFAULT_API_KEYS } from '../services/models/constants';
import { fetchResponses } from '../services/responseService';
import { saveResponseToDatabase } from '../services/databaseService'; 
import { exportToGoogleDocsService } from '../services/exportService';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'ai_consensus_api_keys';

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [consensusResponse, setConsensusResponse] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
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
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkSession();
  }, []);
  
  const setApiKey = (provider: string, key: string) => {
    const updatedKeys = { ...apiKeys, [provider.toLowerCase()]: key };
    setApiKeys(updatedKeys);
    
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
      const result = await fetchResponses(queryText, apiKeys);
      
      const { allResponses, derivedConsensus } = result;
      setConsensusResponse(derivedConsensus);
      
      if (user) {
        saveResponseToDatabase(user.id, queryText, derivedConsensus, allResponses);
      }
      
      setResponses(allResponses);
    } catch (error) {
      console.error('Error submitting query:', error);
      toast({
        title: "Error",
        description: "Failed to get responses from AI models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportToGoogleDocs = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with Google to export to Google Docs",
        duration: 3000,
      });
      return;
    }

    if (!query || !consensusResponse) {
      toast({
        title: "No Content to Export",
        description: "Please run a query first to generate content for export",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await exportToGoogleDocsService(query, consensusResponse);
      
      toast({
        title: "Export Successful",
        description: "Your query results have been exported to Google Docs",
        duration: 3000,
      });

      if (result && result.documentUrl) {
        window.open(result.documentUrl, '_blank');
      }
    } catch (error: any) {
      console.error('Google Docs export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export to Google Docs",
        variant: "destructive",
        duration: 3000,
      });
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
      consensusResponse,
      user,
      exportToGoogleDocs
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

export type { Response };
