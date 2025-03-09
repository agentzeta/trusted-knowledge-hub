
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Upload, Shield } from 'lucide-react';

const BlockchainLoadingState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow"
    >
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="relative">
          <Shield className="h-10 w-10 text-orange-500 mb-2 opacity-50" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          </div>
        </div>
        <h3 className="text-center font-medium mt-2">Recording on Blockchain</h3>
      </div>
      
      <div className="space-y-4 mt-4">
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="flex items-center">
            <Upload className="h-4 w-4 text-blue-500 mr-2 animate-pulse" />
            <span className="text-sm">Sending to Flare blockchain...</span>
          </div>
        </div>
        
        <div className="bg-gray-50 p-3 rounded-md opacity-50">
          <div className="flex items-center">
            <Upload className="h-4 w-4 text-blue-500 mr-2" />
            <span className="text-sm">Creating attestation with EAS...</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-center text-gray-600 mt-4">
        Your consensus response is being recorded on the Flare blockchain and verified through the Ethereum Attestation Service.
      </p>
      
      <div className="text-xs text-center text-gray-500 mt-4">
        <p>This process typically takes 15-30 seconds</p>
        <p className="mt-1">Powered by Flare Data Connector</p>
      </div>
    </motion.div>
  );
};

export default BlockchainLoadingState;
