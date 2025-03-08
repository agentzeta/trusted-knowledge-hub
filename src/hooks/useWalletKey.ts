
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const WALLET_KEY = 'ai_consensus_wallet_key';

export const useWalletKey = () => {
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  useEffect(() => {
    const storedWalletKey = localStorage.getItem(WALLET_KEY);
    if (storedWalletKey) {
      setPrivateKey(storedWalletKey);
    }
  }, []);

  const setWalletKey = (key: string) => {
    setPrivateKey(key);
    localStorage.setItem(WALLET_KEY, key);
    
    toast({
      title: "Wallet Key Saved",
      description: "Your private key has been securely saved in your browser's local storage.",
      duration: 3000,
    });
  };

  return { privateKey, setWalletKey };
};
