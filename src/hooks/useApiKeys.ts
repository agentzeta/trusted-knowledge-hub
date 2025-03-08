
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ApiKeys } from '../types/query';
import { DEFAULT_API_KEYS } from '../services/models/constants';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'ai_consensus_api_keys';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch API keys from Supabase Edge Function
  const fetchApiKeysFromSupabase = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('api-keys');
      
      if (error) {
        console.error('Error fetching API keys from Supabase:', error);
        return false;
      }
      
      if (data?.apiKeys) {
        setApiKeys(data.apiKeys);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.apiKeys));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // First try to load from Supabase
    fetchApiKeysFromSupabase().then(success => {
      // If Supabase fetch fails, try localStorage
      if (!success) {
        const storedKeys = localStorage.getItem(STORAGE_KEY);
        if (storedKeys) {
          try {
            const parsedKeys = JSON.parse(storedKeys);
            setApiKeys(parsedKeys);
          } catch (error) {
            console.error('Error parsing stored API keys:', error);
          }
        }
      }
    });
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

  return { apiKeys, setApiKey, isLoading, refreshApiKeys: fetchApiKeysFromSupabase };
};
