
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';

const BlockchainKeyForm: React.FC = () => {
  const { setWalletKey, privateKey } = useQueryContext();
  const [walletKey, setWalletKeyState] = React.useState(privateKey || '');

  const handleSaveWalletKey = () => {
    if (walletKey) setWalletKey(walletKey);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="wallet-key">Ethereum Private Key</Label>
        <Input
          id="wallet-key"
          type="password"
          placeholder="0x..."
          value={walletKey}
          onChange={(e) => setWalletKeyState(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Required for recording consensus data on Flare blockchain and creating attestations.
          <br />
          <span className="text-amber-600">Warning: Use only a test wallet with minimal funds.</span>
        </p>
      </div>
      <Button onClick={handleSaveWalletKey} disabled={!walletKey}>Save Wallet Key</Button>
    </div>
  );
};

export default BlockchainKeyForm;
