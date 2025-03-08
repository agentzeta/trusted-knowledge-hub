
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { recordOnFlareBlockchain, createAttestation } from '../services/blockchainService';
import { Response } from '../types/query';
import { saveResponseToDatabase } from '../services/databaseService';

export const useBlockchainRecording = () => {
  const [blockchainReference, setBlockchainReference] = useState<string | null>(null);
  const [attestationId, setAttestationId] = useState<string | null>(null);
  const [isRecordingOnChain, setIsRecordingOnChain] = useState(false);

  const recordResponseOnBlockchain = async (
    privateKey: string | null,
    userId: string | null,
    queryText: string,
    consensusResponse: string,
    responses: Response[]
  ) => {
    if (!privateKey) return;
    
    setIsRecordingOnChain(true);
    
    try {
      const txHash = await recordOnFlareBlockchain(
        privateKey,
        queryText,
        consensusResponse
      );
      setBlockchainReference(txHash);
      
      const attestationUID = await createAttestation(
        privateKey,
        queryText,
        consensusResponse
      );
      setAttestationId(attestationUID);
      
      if (userId) {
        await saveResponseToDatabase(
          userId, 
          queryText, 
          consensusResponse, 
          responses,
          txHash,
          attestationUID
        );
      }
      
      toast({
        title: "Blockchain Verification Complete",
        description: "Your consensus response has been recorded on the Flare blockchain and attested via EAS.",
        duration: 5000,
      });
      
      return { txHash, attestationUID };
    } catch (error) {
      console.error('Blockchain recording error:', error);
      toast({
        title: "Blockchain Recording Failed",
        description: "An error occurred while recording to the blockchain. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
      return null;
    } finally {
      setIsRecordingOnChain(false);
    }
  };

  return {
    blockchainReference,
    attestationId,
    isRecordingOnChain,
    recordResponseOnBlockchain
  };
};
