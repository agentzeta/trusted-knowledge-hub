
import { supabase } from '@/integrations/supabase/client';

export const exportToGoogleDocsService = async (
  query: string,
  consensusResponse: string
) => {
  const { data, error } = await supabase.functions.invoke('google-docs-export', {
    body: {
      query,
      consensusResponse,
    }
  });

  if (error) {
    throw error;
  }

  return data;
};
