
import { Response } from '../types/query';
import { supabase } from '@/integrations/supabase/client';

export const saveResponseToDatabase = async (
  userId: string,
  queryText: string, 
  consensusText: string, 
  sourceResponses: Response[]
) => {
  try {
    const sourceResponsesJson = sourceResponses.map(resp => ({
      id: resp.id,
      content: resp.content,
      source: resp.source,
      verified: resp.verified,
      timestamp: resp.timestamp,
      confidence: resp.confidence
    }));
    
    const { error } = await supabase
      .from('consensus_responses')
      .insert({
        user_id: userId,
        query: queryText,
        consensus_response: consensusText,
        source_responses: sourceResponsesJson,
      });
      
    if (error) {
      console.error('Error saving response:', error);
    }
  } catch (error) {
    console.error('Error saving response to database:', error);
  }
};
