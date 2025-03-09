
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EASExplorerDialogProps {
  attestationId: string | null;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
}

const EASExplorerDialog: React.FC<EASExplorerDialogProps> = ({ 
  attestationId, 
  showDialog, 
  setShowDialog 
}) => {
  const openEASExplorer = (attestId: string) => {
    window.open(`https://attestation.flare.network/attestation/${attestId}`, '_blank');
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ethereum Attestation Service</DialogTitle>
          <DialogDescription>
            Attestation details for your consensus response.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Attestation ID:</h3>
          <p className="text-xs bg-gray-100 p-2 rounded break-all">{attestationId}</p>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              This attestation verifies the authenticity and timestamp of your AI consensus response
              using the Ethereum Attestation Service on the Flare network.
            </p>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Close
              </Button>
              {attestationId && (
                <Button 
                  onClick={() => openEASExplorer(attestationId)}
                  className="flex items-center gap-1"
                >
                  View on EAS Explorer <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EASExplorerDialog;
