
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ApiKeys } from '@/types/query';
import { toast } from '@/components/ui/use-toast';

// Default API keys from environment variables or empty strings
const DEFAULT_API_KEYS: ApiKeys = {
  openai: '',
  anthropic: '',
  anthropicClaude35: '',
  gemini: '',
  geminiProExperimental: '',
  perplexity: '',
  deepseek: '',
  grok: '',
  qwen: '',
  openrouter: ''
};

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch API keys from Supabase
        const { data, error } = await supabase.functions.invoke('api-keys', {
          method: 'GET'
        });
        
        if (error) {
          console.error('Error fetching API keys:', error);
          throw new Error('Failed to fetch API keys');
        }
        
        // If we got data back, use it
        if (data && Object.keys(data).length > 0) {
          console.log('Loaded API keys from Supabase');
          setApiKeys(data);
        } else {
          // Fallback to localStorage
          try {
            const storedKeys = localStorage.getItem('apiKeys');
            if (storedKeys) {
              console.log('Loaded API keys from localStorage');
              setApiKeys(JSON.parse(storedKeys));
            }
          } catch (e) {
            console.error('Error parsing API keys from localStorage:', e);
          }
        }
      } catch (error) {
        console.error('Error in fetchApiKeys:', error);
        
        // Always try localStorage as fallback
        try {
          const storedKeys = localStorage.getItem('apiKeys');
          if (storedKeys) {
            console.log('Loaded API keys from localStorage (fallback)');
            setApiKeys(JSON.parse(storedKeys));
          }
        } catch (e) {
          console.error('Error parsing API keys from localStorage:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKeys();
  }, []);

  const setApiKey = (provider: string, key: string) => {
    try {
      const updatedKeys = { ...apiKeys, [provider]: key };
      setApiKeys(updatedKeys);
      localStorage.setItem('apiKeys', JSON.stringify(updatedKeys));
      
      toast({
        title: "API Key Updated",
        description: `${provider} API key has been updated successfully`,
      });
    } catch (error) {
      console.error('Error saving API key:', error);
      
      toast({
        title: "Error",
        description: "Failed to save API key",
        variant: "destructive",
      });
    }
  };

  return { apiKeys, setApiKey, isLoading };
};
