
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ApiKeys } from '@/types/query';
import { toast } from '@/components/ui/use-toast';

// Default API keys from environment variables or empty strings
const DEFAULT_API_KEYS: ApiKeys = {
  openai: '',
  anthropic: '',
  anthropicClaude35: '', // Kept for backward compatibility
  gemini: '',
  geminiProExperimental: '',
  perplexity: '',
  deepseek: '',
  grok: '',
  qwen: '',
  openrouter: '',
  llama: '',      // Added for Llama models
  elevenlabs: ''  // Added for ElevenLabs TTS
};

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeys>(DEFAULT_API_KEYS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch API keys from Supabase Edge Function
        console.log('Fetching API keys from Supabase Edge Function');
        const { data, error } = await supabase.functions.invoke('api-keys', {
          method: 'GET'
        });
        
        if (error) {
          console.error('Error fetching API keys from Supabase:', error);
          throw new Error('Failed to fetch API keys from Supabase');
        }
        
        // If we got data back and it has apiKeys, use them
        if (data && data.apiKeys && Object.keys(data.apiKeys).length > 0) {
          console.log('Successfully loaded API keys from Supabase:', Object.keys(data.apiKeys).filter(k => !!data.apiKeys[k]));
          setApiKeys(data.apiKeys);
        } else {
          console.log('No API keys found in Supabase response, falling back to localStorage');
          // Fallback to localStorage
          try {
            const storedKeys = localStorage.getItem('apiKeys');
            if (storedKeys) {
              const parsedKeys = JSON.parse(storedKeys);
              console.log('Loaded API keys from localStorage:', Object.keys(parsedKeys).filter(k => !!parsedKeys[k]));
              setApiKeys(parsedKeys);
            } else {
              console.log('No API keys found in localStorage');
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
      
      // Also update the Edge Function if possible
      try {
        supabase.functions.invoke('api-keys', {
          method: 'POST',
          body: { provider, key }
        }).then(({ error }) => {
          if (error) {
            console.error('Error saving API key to Supabase:', error);
          } else {
            console.log(`Successfully saved ${provider} API key to Supabase`);
          }
        });
      } catch (e) {
        console.error('Error calling Supabase to save API key:', e);
      }
      
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
