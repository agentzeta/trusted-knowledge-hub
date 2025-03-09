
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Download } from 'lucide-react';
import { useQueryContext } from '@/hooks/useQueryContext';
import UploadToBlockchainButton from '@/components/blockchain/UploadToBlockchainButton';

interface ConsensusResponseProps {
  consensusResponse: string;
  timestamp: number | null;
}

const ConsensusResponse: React.FC<ConsensusResponseProps> = ({ 
  consensusResponse, 
  timestamp 
}) => {
  const { exportToGoogleDocs } = useQueryContext();
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
          
          <div className="mt-6 flex flex-wrap gap-3 items-center justify-between pt-4 border-t">
            {formattedDate && (
              <span className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Generated on {formattedDate}
              </span>
            )}
            
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={exportToGoogleDocs}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Export to Docs
              </button>
              
              <UploadToBlockchainButton 
                className="px-3 py-1.5 text-xs font-medium" 
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsensusResponse;
