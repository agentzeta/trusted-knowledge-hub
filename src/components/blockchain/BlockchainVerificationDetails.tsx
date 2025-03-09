
import React, { useState } from 'react';
import { Shield, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';
import FlareExplorerDialog from './FlareExplorerDialog';
import EASExplorerDialog from './EASExplorerDialog';
import { Button } from '@/components/ui/button';

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
  const [showFlareDialog, setShowFlareDialog] = useState(false);
  const [showEASDialog, setShowEASDialog] = useState(false);
  
  const formattedDate = timestamp 
    ? format(new Date(timestamp), 'PPpp') 
    : 'Unknown date';

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium mb-2">Flare Blockchain Verification:</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="flex gap-2 text-sm">
              <span className="text-gray-600">TX</span>
              <span className="font-mono text-blue-700">
                {blockchainReference ? 
                  `${blockchainReference.substring(0, 6)}...${blockchainReference.substring(blockchainReference.length - 4)}` : 
                  'Not recorded yet'}
              </span>
            </span>
          </div>
          
          {blockchainReference && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFlareDialog(true)}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">View</span>
            </Button>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Ethereum Attestation Service:</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-purple-500" />
            <span className="flex gap-2 text-sm">
              <span className="text-gray-600">EAS</span>
              <span className="font-mono text-purple-700">
                {attestationId ? 
                  `${attestationId.substring(0, 6)}...${attestationId.substring(attestationId.length - 4)}` : 
                  'Not attested yet'}
              </span>
            </span>
          </div>
          
          {attestationId && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowEASDialog(true)}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              <span className="text-xs">View</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="border-t pt-3 mt-3">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>Recorded on: {formattedDate}</span>
        </div>
      </div>
      
      {/* FlareExplorer Dialog */}
      {blockchainReference && (
        <FlareExplorerDialog
          showDialog={showFlareDialog}
          setShowDialog={setShowFlareDialog}
          transactionHash={blockchainReference}
        />
      )}
      
      {/* EASExplorer Dialog */}
      {attestationId && (
        <EASExplorerDialog
          showDialog={showEASDialog}
          setShowDialog={setShowEASDialog}
          attestationId={attestationId}
        />
      )}
    </div>
  );
};

export default BlockchainVerificationDetails;
