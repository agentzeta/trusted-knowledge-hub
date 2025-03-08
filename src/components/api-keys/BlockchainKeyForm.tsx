
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { ExternalLink } from "lucide-react";

const BlockchainKeyForm: React.FC = () => {
  const { setWalletKey, privateKey } = useQueryContext();
  const [walletKey, setWalletKeyState] = React.useState(privateKey || '');

  const handleSaveWalletKey = () => {
    if (walletKey) setWalletKey(walletKey);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="wallet-key">Ethereum Private Key (for Flare Network)</Label>
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
          <span className="text-amber-600 font-medium">Warning: Use only a test wallet with minimal funds.</span>
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm text-blue-600">
            How to get an Ethereum testnet private key
          </AccordionTrigger>
          <AccordionContent>
            <ol className="text-xs text-gray-600 list-decimal pl-5 space-y-1">
              <li>Install <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline inline-flex items-center">MetaMask <ExternalLink className="h-3 w-3 ml-0.5" /></a></li>
              <li>Create a new wallet</li>
              <li>Switch to the Flare network or a testnet like Sepolia</li>
              <li>For testnet: Request free test tokens from a faucet</li>
              <li>In MetaMask: Three dots menu → Account details → Export private key</li>
              <li>Enter your password and copy the private key</li>
              <li>Paste it here (it starts with 0x)</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
            
      <Button 
        onClick={handleSaveWalletKey} 
        disabled={!walletKey}
        className="w-full"
      >
        Save Wallet Key
      </Button>
      
      <p className="text-xs text-gray-500 mt-1">
        Your private key is stored only in your browser's local storage and is never sent to our servers.
      </p>
    </div>
  );
};

export default BlockchainKeyForm;
