
import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const BlockchainLoadingState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow text-center"
    >
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <Shield className="h-10 w-10 text-blue-500" />
          <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        </div>
        
        <h3 className="font-medium mb-2">Recording on Blockchain</h3>
        <p className="text-sm text-gray-500">
          Please wait while we record your consensus response on the Flare blockchain.
          This process may take a few moments.
        </p>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
          <motion.div 
            className="bg-blue-600 h-1.5 rounded-full" 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BlockchainLoadingState;
