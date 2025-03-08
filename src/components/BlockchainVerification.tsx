
import React from 'react';
import { motion } from 'framer-motion';
import { useQueryContext } from '@/hooks/useQueryContext';
import { Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BlockchainVerification: React.FC = () => {
  const { blockchainReference, attestationId, isRecordingOnChain } = useQueryContext();
  
  const openFlareExplorer = (txHash: string) => {
    window.open(`https://flare-explorer.flare.network/tx/${txHash}`, '_blank');
  };
  
  const openEASExplorer = (attestId: string) => {
    window.open(`https://attestation.flare.network/attestation/${attestId}`, '_blank');
  };
  
  if (isRecordingOnChain) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow"
      >
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500 mr-2" />
          <h3 className="text-center font-medium">Recording on Blockchain</h3>
        </div>
        <p className="text-sm text-center text-gray-600">
          Your consensus response is being recorded on the Flare blockchain and verified through the Ethereum Attestation Service.
        </p>
      </motion.div>
    );
  }
  
  if (!blockchainReference && !attestationId) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow"
    >
      <h3 className="text-center font-medium mb-4">Blockchain Verification</h3>
      
      <div className="space-y-4">
        {blockchainReference && (
          <div className="p-3 rounded-md bg-green-50 border border-green-100">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                Flare Blockchain
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-blue-600 p-0 h-auto" 
                onClick={() => openFlareExplorer(blockchainReference)}
              >
                View on Explorer
              </Button>
            </div>
            <p className="text-xs text-gray-500 break-all">{blockchainReference}</p>
          </div>
        )}
        
        {attestationId && (
          <div className="p-3 rounded-md bg-green-50 border border-green-100">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                EAS Attestation
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-blue-600 p-0 h-auto" 
                onClick={() => openEASExplorer(attestationId)}
              >
                View Attestation
              </Button>
            </div>
            <p className="text-xs text-gray-500 break-all">{attestationId}</p>
          </div>
        )}
        
        <div className="mt-4 text-xs text-center text-gray-500">
          <p>Permanently recorded on {new Date().toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BlockchainVerification;
