
import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, Shield } from 'lucide-react';
import { useQueryContext } from '@/hooks/useQueryContext';
import { toast } from '@/components/ui/use-toast';
import { useBlockchainRecording } from '@/hooks/useBlockchainRecording';
import { format } from 'date-fns';

interface UploadToBlockchainButtonProps {
  className?: string;
}

const UploadToBlockchainButton: React.FC<UploadToBlockchainButtonProps> = ({ className }) => {
  const { query, consensusResponse, responses, privateKey, user } = useQueryContext();
  const { recordResponseOnBlockchain, isRecordingOnChain } = useBlockchainRecording();

  const handleUploadToBlockchain = async () => {
    if (!query || !consensusResponse) {
      toast({
        title: "No Content to Record",
        description: "Please run a query first to generate content for blockchain recording",
        duration: 3000,
      });
      return;
    }

    if (!privateKey) {
      toast({
        title: "Wallet Key Required",
        description: "Please add your wallet key in settings to record on blockchain",
        duration: 3000,
      });
      return;
    }

    try {
      // Add timestamp to the consensus response
      const timestamp = new Date();
      const timestampedConsensus = `${consensusResponse}\n\nVerification Timestamp: ${format(timestamp, 'MMMM d, yyyy HH:mm:ss')}`;
      
      await recordResponseOnBlockchain(
        privateKey,
        user?.id || null,
        query,
        timestampedConsensus,
        responses
      );
      
      toast({
        title: "Blockchain Recording Initiated",
        description: "Your consensus response is being recorded on the Flare blockchain",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error uploading to blockchain:', error);
      toast({
        title: "Recording Failed",
        description: error.message || "Failed to record on blockchain",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Button
      onClick={handleUploadToBlockchain}
      disabled={isRecordingOnChain || !query || !consensusResponse || !privateKey}
      className={`flex items-center gap-2 ${className}`}
      variant="outline"
    >
      {isRecordingOnChain ? (
        <>
          <div className="animate-spin mr-2">
            <Database className="h-4 w-4" />
          </div>
          Recording...
        </>
      ) : (
        <>
          <Shield className="h-4 w-4" />
          Verify on Blockchain
        </>
      )}
    </Button>
  );
};

export default UploadToBlockchainButton;
