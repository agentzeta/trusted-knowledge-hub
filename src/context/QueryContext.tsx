
import React, { createContext, ReactNode } from 'react';
import { QueryContextType } from '../types/query';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useApiKeys } from '../hooks/useApiKeys';
import { useWalletKey } from '../hooks/useWalletKey';
import { useBlockchainRecording } from '../hooks/useBlockchainRecording';
import { useQuerySubmission } from '../hooks/useQuerySubmission';
import { exportToGoogleDocsService } from '../services/exportService';
import { toast } from '@/components/ui/use-toast';

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const QueryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useSupabaseAuth();
  const { apiKeys, setApiKey } = useApiKeys();
  const { privateKey, setWalletKey } = useWalletKey();
  const { 
    blockchainReference, 
    attestationId, 
    isRecordingOnChain,
    recordResponseOnBlockchain 
  } = useBlockchainRecording();
  
  const { 
    query, 
    responses, 
    isLoading, 
    consensusResponse, 
    submitQuery 
  } = useQuerySubmission(apiKeys, user, privateKey);

  // Manual blockchain verification function
  const verifyOnBlockchain = async () => {
    if (!privateKey) {
      toast({
        title: "Private Key Required",
        description: "Please add your Ethereum wallet private key in Settings to verify on blockchain.",
        duration: 3000,
      });
      return;
    }

    if (!query || !consensusResponse) {
      toast({
        title: "No Content to Verify",
        description: "Please run a query first to generate content for verification.",
        duration: 3000,
      });
      return;
    }

    try {
      await recordResponseOnBlockchain(
        privateKey,
        user?.id || null,
        query,
        consensusResponse,
        responses
      );
      
      toast({
        title: "Verification Started",
        description: "Your consensus response is being recorded on the Flare blockchain.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Blockchain verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify on blockchain",
        variant: "destructive",
        duration: 3000,
      });
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
      exportToGoogleDocs,
      verifyOnBlockchain
    }}>
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext };
