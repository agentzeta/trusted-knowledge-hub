import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { QueryContextType, ApiKeys, Response } from '../types/query';
import { DEFAULT_API_KEYS } from '../services/models/constants';
import { fetchResponses } from '../services/responseService';
import { saveResponseToDatabase } from '../services/databaseService'; 
import { exportToGoogleDocsService } from '../services/exportService';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { recordOnFlareBlockchain, createAttestation } from '../services/blockchainService';

const STORAGE_KEY = 'ai_consensus_api_keys';
const WALLET_KEY = 'ai_consensus_wallet_key';

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [consensusResponse, setConsensusResponse] = useState<string | null>(null);
  const [blockchainReference, setBlockchainReference] = useState<string | null>(null);
  const [attestationId, setAttestationId] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [isRecordingOnChain, setIsRecordingOnChain] = useState(false);
  
  const { user } = useSupabaseAuth();
  
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

    const storedWalletKey = localStorage.getItem(WALLET_KEY);
    if (storedWalletKey) {
      setPrivateKey(storedWalletKey);
    }
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

  const setWalletKey = (key: string) => {
    setPrivateKey(key);
    localStorage.setItem(WALLET_KEY, key);
    
    toast({
      title: "Wallet Key Saved",
      description: "Your private key has been securely saved in your browser's local storage.",
      duration: 3000,
    });
  };

  const submitQuery = async (queryText: string) => {
    setQuery(queryText);
    setIsLoading(true);
    setConsensusResponse(null);
    setBlockchainReference(null);
    setAttestationId(null);
    
    try {
      const result = await fetchResponses(queryText, apiKeys);
      
      const { allResponses, derivedConsensus } = result;
      setConsensusResponse(derivedConsensus);
      setResponses(allResponses);

      if (user) {
        await saveResponseToDatabase(user.id, queryText, derivedConsensus, allResponses);
      }
      
      if (privateKey) {
        setIsRecordingOnChain(true);
        
        try {
          const txHash = await recordOnFlareBlockchain(
            privateKey,
            queryText,
            derivedConsensus
          );
          setBlockchainReference(txHash);
          
          const attestationUID = await createAttestation(
            privateKey,
            queryText,
            derivedConsensus
          );
          setAttestationId(attestationUID);
          
          if (user) {
            await saveResponseToDatabase(
              user.id, 
              queryText, 
              derivedConsensus, 
              allResponses,
              txHash,
              attestationUID
            );
          }
          
          toast({
            title: "Blockchain Verification Complete",
            description: "Your consensus response has been recorded on the Flare blockchain and attested via EAS.",
            duration: 5000,
          });
        } catch (error) {
          console.error('Blockchain recording error:', error);
          toast({
            title: "Blockchain Recording Failed",
            description: "An error occurred while recording to the blockchain. Please try again later.",
            variant: "destructive",
            duration: 5000,
          });
        } finally {
          setIsRecordingOnChain(false);
        }
      }
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
      setWalletKey,
      privateKey,
      apiKeys,
      consensusResponse,
      blockchainReference,
      attestationId,
      isRecordingOnChain,
      user,
      exportToGoogleDocs
    }}>
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext };
