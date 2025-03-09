
import React, { useState } from 'react';
import { Check, ExternalLink, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
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
  
  // Format timestamp properly, handling both seconds and milliseconds formats
  const formattedDate = timestamp 
    ? format(new Date(timestamp > 10000000000 ? timestamp : timestamp * 1000), 'PPpp') // Detailed date and time format
    : null;
    
  const openFlareExplorer = (txHash: string) => {
    window.open(`https://flare-explorer.flare.network/tx/${txHash}`, '_blank');
  };
  
  const openEASExplorer = (attestId: string) => {
    window.open(`https://attestation.flare.network/attestation/${attestId}`, '_blank');
  };

  return (
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
                onClick={() => blockchainReference && openFlareExplorer(blockchainReference)}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Explorer
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 break-all">{blockchainReference.substring(0, 20)}...</p>
          {blockchainReference && (
            <FlareExplorerDialog 
              txHash={blockchainReference} 
              showDialog={showFlareExplorer} 
              setShowDialog={setShowFlareExplorer} 
            />
          )}
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
                onClick={() => attestationId && openEASExplorer(attestationId)}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Explorer
              </Button>
            </div>
          </div>
          <p className="text-xs text-gray-500 break-all">{attestationId.substring(0, 20)}...</p>
          {attestationId && (
            <EASExplorerDialog 
              attestId={attestationId} 
              showDialog={showEASExplorer} 
              setShowDialog={setShowEASExplorer} 
            />
          )}
        </div>
      )}
      
      <div className="mt-4 text-xs text-center text-gray-500">
        <p>Permanently recorded on {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default BlockchainVerificationDetails;
