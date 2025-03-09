
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FlareExplorerDialog from './FlareExplorerDialog';
import EASExplorerDialog from './EASExplorerDialog';

interface BlockchainVerificationDetailsProps {
  blockchainReference: string | null;
  attestationId: string | null;
  timestamp: number | null;
}

const BlockchainVerificationDetails: React.FC<BlockchainVerificationDetailsProps> = ({ 
  blockchainReference, 
  attestationId, 
  timestamp 
}) => {
  const [showFlareExplorer, setShowFlareExplorer] = useState(false);
  const [showEASExplorer, setShowEASExplorer] = useState(false);
  
  const formattedDate = timestamp 
    ? format(new Date(timestamp), 'MMM d, yyyy h:mm a') 
    : 'Unknown date';
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center text-center mb-4">
        <Shield className="h-10 w-10 text-orange-500 mb-2" />
        <p className="text-sm text-gray-700">
          This consensus response has been verified by Flare Data Connector and recorded on the blockchain for tamper-proof verification.
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm font-medium">Flare Blockchain</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFlareExplorer(true)}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-sm font-medium">Ethereum Attestation</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEASExplorer(true)}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
      </div>
      
      <div className="pt-2 text-xs text-gray-500 border-t border-gray-200">
        <p>Verified on {formattedDate}</p>
        <p className="mt-1">Transaction ID: {blockchainReference ? `${blockchainReference.substring(0, 8)}...` : 'N/A'}</p>
      </div>
      
      {/* Flare Explorer Dialog */}
      <FlareExplorerDialog 
        open={showFlareExplorer} 
        onOpenChange={setShowFlareExplorer}
        transactionHash={blockchainReference}
      />
      
      {/* EAS Explorer Dialog */}
      <EASExplorerDialog
        open={showEASExplorer}
        onOpenChange={setShowEASExplorer}
        attestationId={attestationId}
      />
    </div>
  );
};

export default BlockchainVerificationDetails;
