
import React from 'react';
import { motion } from 'framer-motion';
import { useQueryContext } from '@/hooks/useQueryContext';
import BlockchainLoadingState from './blockchain/BlockchainLoadingState';
import BlockchainVerificationDetails from './blockchain/BlockchainVerificationDetails';
import { Button } from '@/components/ui/button';
import { Upload, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BlockchainVerification: React.FC = () => {
  const { 
    blockchainReference, 
    attestationId, 
    isRecordingOnChain, 
    responses, 
    consensusResponse,
    query,
    privateKey,
    recordResponseOnBlockchain
  } = useQueryContext();
  
  // Get the timestamp from the first response (all responses have same timestamp)
  const timestamp = responses.length > 0 ? responses[0].timestamp : null;
  
  const handleManualBlockchainRecord = async () => {
    if (!privateKey) {
      toast({
        title: "Wallet Key Required",
        description: "Please add your private key in settings to record on blockchain.",
        variant: "destructive",
      });
      return;
    }
    
    if (!consensusResponse || !query) {
      toast({
        title: "No Content to Record",
        description: "A consensus response is required to record on blockchain.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await recordResponseOnBlockchain(privateKey, null, query, consensusResponse, responses);
      
      toast({
        title: "Recording Initiated",
        description: "Your consensus response is being recorded on the blockchain.",
      });
    } catch (error) {
      console.error('Failed to initiate blockchain recording:', error);
      toast({
        title: "Recording Failed",
        description: "Failed to initiate blockchain recording. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  if (isRecordingOnChain) {
    return <BlockchainLoadingState />;
  }
  
  // Verification not yet performed, show upload button
  if (!blockchainReference && !attestationId && consensusResponse) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow"
      >
        <h3 className="text-center font-medium mb-4">Flare Blockchain Verification</h3>
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Record this consensus response on the Flare blockchain to make it tamper-proof and verifiable.
          </p>
          
          <Button 
            onClick={handleManualBlockchainRecord}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Upload className="w-4 h-4 mr-2" />
            Record on Blockchain
          </Button>
        </div>
        
        <div className="text-xs text-center text-gray-500 mt-4">
          <p>Powered by Flare Data Connector</p>
        </div>
      </motion.div>
    );
  }
  
  // Verification already done, show details
  if (blockchainReference || attestationId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow"
      >
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="text-green-500 w-5 h-5 mr-2" />
          <h3 className="text-center font-medium">Blockchain Verification</h3>
        </div>
        
        <BlockchainVerificationDetails
          blockchainReference={blockchainReference}
          attestationId={attestationId}
          timestamp={timestamp}
        />
      </motion.div>
    );
  }
  
  return null;
};

export default BlockchainVerification;
