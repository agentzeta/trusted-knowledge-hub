
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { recordOnFlareBlockchain, createAttestation } from '../services/blockchainService';
import { Response } from '../types/query';
import { saveResponseToDatabase } from '../services/databaseService';
import { ToastAction } from '@/components/ui/toast';
import React from 'react';
import { submitToFlareTee, verifyTeeConsensusOnChain } from '../utils/flareTeeUtils';

export const useBlockchainRecording = () => {
  const [blockchainReference, setBlockchainReference] = useState<string | null>(null);
  const [attestationId, setAttestationId] = useState<string | null>(null);
  const [isRecordingOnChain, setIsRecordingOnChain] = useState(false);
  const [teeVerificationId, setTeeVerificationId] = useState<string | null>(null);

  const recordResponseOnBlockchain = async (
    privateKey: string | null,
    userId: string | null,
    queryText: string,
    consensusResponse: string,
    responses: Response[]
  ) => {
    if (!privateKey) {
      console.error('No private key provided for blockchain recording');
      return null;
    }
    
    setIsRecordingOnChain(true);
    
    try {
      // Add timestamp to blockchain record
      const timestamp = Math.floor(Date.now() / 1000);
      console.log(`Recording on blockchain with timestamp: ${timestamp}`);
      
      // Step 1: Process responses through Flare TEE for secure consensus
      console.log('Starting TEE verification process...');
      const teeResult = await submitToFlareTee(
        queryText,
        responses,
        privateKey
      );
      
      setTeeVerificationId(teeResult.verificationId);
      console.log(`TEE verification completed with ID: ${teeResult.verificationId}`);
      
      // Step 2: Verify the TEE result on chain
      const teeTxHash = await verifyTeeConsensusOnChain(
        teeResult.verificationId,
        teeResult.signature,
        privateKey
      );
      console.log(`TEE verification recorded on blockchain: ${teeTxHash}`);
      
      // Step 3: Record on Flare blockchain (traditional method as backup)
      const txHash = await recordOnFlareBlockchain(
        privateKey,
        queryText,
        consensusResponse,
        timestamp
      );
      setBlockchainReference(txHash);
      console.log(`Transaction recorded on blockchain: ${txHash}`);
      
      // Step 4: Create attestation
      const attestationUID = await createAttestation(
        privateKey,
        queryText,
        consensusResponse,
        timestamp
      );
      setAttestationId(attestationUID);
      console.log(`Attestation created: ${attestationUID}`);
      
      // Step 5: Save to database if user is logged in
      if (userId) {
        await saveResponseToDatabase(
          userId, 
          queryText, 
          consensusResponse, 
          responses,
          txHash,
          attestationUID,
          teeResult.verificationId // Add TEE verification ID to database
        );
        console.log(`Response saved to database for user: ${userId}`);
      }
      
      // Create a toast notification with transaction details
      toast({
        title: "Blockchain Verification Complete",
        description: `Your consensus response has been verified in Flare's TEE and recorded on the blockchain. Transaction Hash: ${txHash.substring(0, 18)}...${txHash.substring(txHash.length - 6)}`,
        duration: 10000,
        action: (
          <ToastAction 
            altText="View on Flare Explorer" 
            onClick={() => window.open(`https://flare-explorer.flare.network/tx/${txHash}`, '_blank')}
          >
            View on Flare Explorer
          </ToastAction>
        )
      });
      
      return { 
        txHash, 
        attestationUID,
        teeVerificationId: teeResult.verificationId 
      };
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
    teeVerificationId,
    isRecordingOnChain,
    recordResponseOnBlockchain
  };
};
