
import React, { createContext, ReactNode, useState } from 'react';
import { QueryContextType, Response } from '../types/query';
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
    teeVerificationId,
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

  const verifyOnBlockchain = async () => {
    if (!privateKey || !user || !consensusResponse || !query) return;
    
    try {
      const result = await recordResponseOnBlockchain(
        privateKey,
        user.id,
        query,
        consensusResponse,
        responses
      );
      
      // These are now managed by the useBlockchainRecording hook
      // so we don't need to set them here
    } catch (error) {
      console.error('Error verifying on blockchain:', error);
      throw error;
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
      teeVerificationId,
      isRecordingOnChain,
      verifyOnBlockchain,
      exportToGoogleDocs,
      user
    }}>
      {children}
    </QueryContext.Provider>
  );
};

export { QueryContext };
