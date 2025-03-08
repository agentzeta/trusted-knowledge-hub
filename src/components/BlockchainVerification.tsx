
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryContext } from '@/hooks/useQueryContext';
import { Check, Loader2, Clock, ExternalLink, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BlockchainVerification: React.FC = () => {
  const { blockchainReference, attestationId, isRecordingOnChain, responses } = useQueryContext();
  const [showFlareExplorer, setShowFlareExplorer] = useState(false);
  const [showEASExplorer, setShowEASExplorer] = useState(false);
  
  // Get the timestamp from the first response (all responses have same timestamp)
  const timestamp = responses.length > 0 ? responses[0].timestamp : null;
  const formattedDate = timestamp 
    ? format(new Date(timestamp * 1000), 'PPpp') // Detailed date and time format
    : null;
  
  const openFlareExplorer = (txHash: string) => {
    window.open(`https://flare-explorer.flare.network/tx/${txHash}`, '_blank');
  };
  
  const openEASExplorer = (attestId: string) => {
    window.open(`https://attestation.flare.network/attestation/${attestId}`, '_blank');
  };

  const FlareExplorerDialog = ({ txHash }: { txHash: string }) => (
    <Dialog open={showFlareExplorer} onOpenChange={setShowFlareExplorer}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Flare Blockchain Transaction</DialogTitle>
          <DialogDescription>
            Transaction details for your consensus response on the Flare blockchain.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Transaction Hash:</h3>
          <p className="text-xs bg-gray-100 p-2 rounded break-all">{txHash}</p>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              This transaction contains a verifiable record of your consensus query and response, 
              permanently stored on the Flare blockchain.
            </p>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowFlareExplorer(false)}>
                Close
              </Button>
              <Button 
                onClick={() => openFlareExplorer(txHash)}
                className="flex items-center gap-1"
              >
                View on Flare Explorer <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const EASExplorerDialog = ({ attestId }: { attestId: string }) => (
    <Dialog open={showEASExplorer} onOpenChange={setShowEASExplorer}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ethereum Attestation Service</DialogTitle>
          <DialogDescription>
            Attestation details for your consensus response.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Attestation ID:</h3>
          <p className="text-xs bg-gray-100 p-2 rounded break-all">{attestId}</p>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              This attestation verifies the authenticity and timestamp of your AI consensus response
              using the Ethereum Attestation Service on the Flare network.
            </p>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowEASExplorer(false)}>
                Close
              </Button>
              <Button 
                onClick={() => openEASExplorer(attestId)}
                className="flex items-center gap-1"
              >
                View on EAS Explorer <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
  
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
        {formattedDate && (
          <div className="p-3 rounded-md bg-blue-50 border border-blue-100 mb-3">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm font-medium">Consensus Timestamp</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
          </div>
        )}
        
        {blockchainReference && (
          <div className="p-3 rounded-md bg-green-50 border border-green-100">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                Flare Blockchain
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-600 p-0 h-auto" 
                  onClick={() => setShowFlareExplorer(true)}
                >
                  View Details
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-600 p-0 h-auto flex items-center" 
                  onClick={() => openFlareExplorer(blockchainReference)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Explorer
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 break-all">{blockchainReference.substring(0, 20)}...</p>
            <FlareExplorerDialog txHash={blockchainReference} />
          </div>
        )}
        
        {attestationId && (
          <div className="p-3 rounded-md bg-green-50 border border-green-100">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1" />
                EAS Attestation
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-600 p-0 h-auto" 
                  onClick={() => setShowEASExplorer(true)}
                >
                  View Details
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-blue-600 p-0 h-auto flex items-center" 
                  onClick={() => openEASExplorer(attestationId)}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Explorer
                </Button>
              </div>
            </div>
            <p className="text-xs text-gray-500 break-all">{attestationId.substring(0, 20)}...</p>
            <EASExplorerDialog attestId={attestationId} />
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
