
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

interface FlareExplorerDialogProps {
  txHash: string;
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
}

const FlareExplorerDialog: React.FC<FlareExplorerDialogProps> = ({ 
  txHash, 
  showDialog, 
  setShowDialog 
}) => {
  const openFlareExplorer = (txHash: string) => {
    window.open(`https://flare-explorer.flare.network/tx/${txHash}`, '_blank');
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
              <Button variant="outline" onClick={() => setShowDialog(false)}>
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
};

export default FlareExplorerDialog;
