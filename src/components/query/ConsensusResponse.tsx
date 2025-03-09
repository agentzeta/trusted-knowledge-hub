
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Shield, Clock, CheckCircle, Upload } from 'lucide-react';
import { useQueryContext } from '@/hooks/useQueryContext';

interface ConsensusResponseProps {
  consensusResponse: string;
  timestamp: number | null;
}

const ConsensusResponse: React.FC<ConsensusResponseProps> = ({ 
  consensusResponse, 
  timestamp 
}) => {
  const { verifyOnBlockchain, privateKey, isRecordingOnChain, blockchainReference } = useQueryContext();
  
  const formattedDate = timestamp 
    ? format(new Date(timestamp), 'MMM d, yyyy h:mm a') 
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200">AI Response</h2>
          <span className="text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
            Multi-Model Consensus
          </span>
        </div>
        <div className="prose prose-slate max-w-none dark:prose-invert">
          <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-line">{consensusResponse}</p>
          
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            {formattedDate && (
              <span className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4 mr-1.5" />
                Generated on {formattedDate}
              </span>
            )}
            
            <div className="flex items-center gap-2">
              {blockchainReference && (
                <span className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Verified on blockchain
                </span>
              )}
              
              {privateKey && (
                <Button 
                  onClick={verifyOnBlockchain}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 self-end transition-all shadow-sm"
                  disabled={isRecordingOnChain || !!blockchainReference}
                >
                  {blockchainReference ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : isRecordingOnChain ? (
                    <Shield className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isRecordingOnChain ? 'Recording...' : blockchainReference ? 'Exported' : 'Export to Blockchain'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsensusResponse;
