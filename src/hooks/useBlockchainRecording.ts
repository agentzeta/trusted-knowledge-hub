
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { recordOnFlareBlockchain, createAttestation } from '../services/blockchainService';
import { Response } from '../types/query';
import { saveResponseToDatabase } from '../services/databaseService';
import { ExternalLink } from 'lucide-react';

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
    if (!privateKey) {
      console.error('No private key provided for blockchain recording');
      return null;
    }
    
    setIsRecordingOnChain(true);
    
    try {
      // Add timestamp to blockchain record
      const timestamp = Math.floor(Date.now() / 1000);
      console.log(`Recording on blockchain with timestamp: ${timestamp}`);
      
      // Record on Flare blockchain
      const txHash = await recordOnFlareBlockchain(
        privateKey,
        queryText,
        consensusResponse,
        timestamp
      );
      setBlockchainReference(txHash);
      console.log(`Transaction recorded on blockchain: ${txHash}`);
      
      // Create attestation
      const attestationUID = await createAttestation(
        privateKey,
        queryText,
        consensusResponse,
        timestamp
      );
      setAttestationId(attestationUID);
      console.log(`Attestation created: ${attestationUID}`);
      
      // Save to database if user is logged in
      if (userId) {
        await saveResponseToDatabase(
          userId, 
          queryText, 
          consensusResponse, 
          responses,
          txHash,
          attestationUID
        );
        console.log(`Response saved to database for user: ${userId}`);
      }
      
      // Create a custom toast with transaction details and link to explorer
      toast({
        title: "Blockchain Verification Complete",
        description: (
          <div className="space-y-2">
            <p>Your consensus response has been recorded on the Flare blockchain.</p>
            <div className="mt-2 text-xs flex flex-col gap-1.5">
              <span className="font-medium">Transaction Hash:</span>
              <code className="bg-gray-100 p-1.5 rounded text-xs block break-all dark:bg-gray-800">
                {txHash.substring(0, 18)}...{txHash.substring(txHash.length - 6)}
              </code>
              <a 
                href={`https://flare-explorer.flare.network/tx/${txHash}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-xs mt-1"
              >
                View on Flare Explorer <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ),
        duration: 10000,
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
