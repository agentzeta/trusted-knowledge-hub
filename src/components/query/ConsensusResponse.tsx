
import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Shield, Clock, CheckCircle, Upload, TrendingUp, FileText, ExternalLink } from 'lucide-react';
import { useQueryContext } from '@/hooks/useQueryContext';
import { toast } from '@/components/ui/use-toast';

interface ConsensusResponseProps {
  consensusResponse: string;
  timestamp: number | null;
}

const ConsensusResponse: React.FC<ConsensusResponseProps> = ({ 
  consensusResponse, 
  timestamp 
}) => {
  const { 
    verifyOnBlockchain, 
    privateKey, 
    isRecordingOnChain, 
    blockchainReference, 
    attestationId,
    query,
    exportToGoogleDocs,
    user
  } = useQueryContext();
  
  const formattedDate = timestamp 
    ? format(new Date(timestamp), 'MMM d, yyyy h:mm a') 
    : null;

  // Check if the query is related to FTSO or stock prediction
  const isFtsoRelated = query?.toLowerCase().includes('ftso') || 
                         query?.toLowerCase().includes('stock prediction') ||
                         query?.toLowerCase().includes('price prediction');
  
  const handleExportToGoogleDocs = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export to Google Docs",
        variant: "destructive",
      });
      return;
    }

    try {
      await exportToGoogleDocs();
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message || "Failed to export to Google Docs",
        variant: "destructive",
      });
    }
  };

  // Function to open Flare Explorer with the transaction hash
  const openFlareExplorer = (txHash: string) => {
    window.open(`https://flare-explorer.flare.network/tx/${txHash}`, '_blank');
  };

  // Function to open EAS Explorer with the attestation ID
  const openEASExplorer = (attestId: string) => {
    window.open(`https://attestation.flare.network/attestation/${attestId}`, '_blank');
  };

  // Handle blockchain verification with enhanced notifications
  const handleVerifyOnBlockchain = async () => {
    if (!privateKey) {
      toast({
        title: "Private Key Required",
        description: "Please add your Ethereum wallet private key in Settings to verify on blockchain.",
        duration: 3000,
      });
      return;
    }

    if (!query || !consensusResponse) {
      toast({
        title: "No Content to Verify",
        description: "Please run a query first to generate content for verification.",
        duration: 3000,
      });
      return;
    }

    try {
      // Start the verification process
      await verifyOnBlockchain();
      
      // We don't show success here as it will be shown after the process completes
      // in the useBlockchainRecording hook
    } catch (error: any) {
      console.error('Blockchain verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to verify on blockchain",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-8 rounded-xl ${
        isFtsoRelated 
          ? 'bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-slate-900/95 dark:to-blue-900/20' 
          : 'bg-white/90 dark:bg-slate-900/90'
      } backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-sm`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200 flex items-center">
            {isFtsoRelated && <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />}
            AI Response
          </h2>
          <span className={`text-sm ${
            isFtsoRelated 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
              : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
          } px-3 py-1 rounded-full font-medium`}>
            {isFtsoRelated ? 'FTSO Enhanced Consensus' : 'Multi-Model Consensus'}
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportToGoogleDocs}
                className="bg-white hover:bg-gray-50 text-blue-600 border-blue-200 flex items-center gap-2"
                disabled={!user || !consensusResponse}
              >
                <FileText className="h-4 w-4" />
                Export to Docs
              </Button>
              
              {privateKey && (
                <Button 
                  onClick={handleVerifyOnBlockchain}
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
