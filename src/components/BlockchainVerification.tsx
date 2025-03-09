
import React from 'react';
import { motion } from 'framer-motion';
import { useQueryContext } from '@/hooks/useQueryContext';
import BlockchainLoadingState from './blockchain/BlockchainLoadingState';
import BlockchainVerificationDetails from './blockchain/BlockchainVerificationDetails';

const BlockchainVerification: React.FC = () => {
  const { blockchainReference, attestationId, teeVerificationId, isRecordingOnChain, responses } = useQueryContext();
  
  // Get the timestamp from the first response (all responses have same timestamp)
  const timestamp = responses.length > 0 ? responses[0].timestamp : null;
  
  if (isRecordingOnChain) {
    return <BlockchainLoadingState />;
  }
  
  if (!blockchainReference && !attestationId && !teeVerificationId) {
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
      
      <BlockchainVerificationDetails
        blockchainReference={blockchainReference}
        attestationId={attestationId}
        teeVerificationId={teeVerificationId}
        timestamp={timestamp}
      />
    </motion.div>
  );
};

export default BlockchainVerification;
