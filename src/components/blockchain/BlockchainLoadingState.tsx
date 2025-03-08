
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const BlockchainLoadingState: React.FC = () => {
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
};

export default BlockchainLoadingState;
