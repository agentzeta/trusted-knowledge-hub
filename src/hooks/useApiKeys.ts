
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ApiKeys } from '../types/query';
import { DEFAULT_API_KEYS } from '../services/models/constants';

const STORAGE_KEY = 'ai_consensus_api_keys';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);

  useEffect(() => {
    const storedKeys = localStorage.getItem(STORAGE_KEY);
    if (storedKeys) {
      try {
        const parsedKeys = JSON.parse(storedKeys);
        setApiKeys(parsedKeys);
      } catch (error) {
        console.error('Error parsing stored API keys:', error);
      }
    }
  }, []);

  const setApiKey = (provider: string, key: string) => {
    const updatedKeys = { ...apiKeys, [provider.toLowerCase()]: key };
    setApiKeys(updatedKeys);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKeys));
    
    toast({
      title: "API Key Saved",
      description: `${provider} API key has been saved and will persist across sessions.`,
      duration: 3000,
    });
  };

  return { apiKeys, setApiKey };
};
