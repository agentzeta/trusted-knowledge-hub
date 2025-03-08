
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface ConsensusResponseProps {
  consensusResponse: string;
  timestamp: number | null;
}

const ConsensusResponse: React.FC<ConsensusResponseProps> = ({ 
  consensusResponse, 
  timestamp 
}) => {
  const formattedDate = timestamp 
    ? format(new Date(timestamp), 'MMM d, yyyy h:mm a') 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 rounded-xl glass card-shadow"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">AI Response:</h2>
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            Multi-Model Consensus
          </span>
        </div>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-line">{consensusResponse}</p>
          
          {formattedDate && (
            <div className="mt-4 pt-4 border-t text-sm text-gray-500">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Generated on {formattedDate}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ConsensusResponse;
