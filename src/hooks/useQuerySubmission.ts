
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { fetchResponses } from '../services/responseService';
import { saveResponseToDatabase } from '../services/databaseService';
import { Response } from '../types/query';
import { verifyResponses } from '../utils/consensusUtils';

export const useQuerySubmission = (
  apiKeys: any,
  user: any,
  recordOnBlockchain: (
    privateKey: string | null,
    userId: string | null, 
    queryText: string, 
    consensusResponse: string, 
    responses: Response[]
  ) => Promise<any>,
  privateKey: string | null
) => {
  const [query, setQuery] = useState<string | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [consensusResponse, setConsensusResponse] = useState<string | null>(null);

  const submitQuery = async (queryText: string) => {
    setQuery(queryText);
    setIsLoading(true);
    setConsensusResponse(null);
    
    try {
      const result = await fetchResponses(queryText, apiKeys);
      
      const { allResponses, derivedConsensus } = result;
      setConsensusResponse(derivedConsensus);
      
      // Verify responses based on consensus
      const verifiedResponses = verifyResponses(allResponses, derivedConsensus);
      setResponses(verifiedResponses);

      if (user) {
        await saveResponseToDatabase(user.id, queryText, derivedConsensus, verifiedResponses);
      }
      
      if (privateKey) {
        await recordOnBlockchain(
          privateKey,
          user?.id || null,
          queryText,
          derivedConsensus,
          verifiedResponses
        );
      }
    } catch (error) {
      console.error('Error submitting query:', error);
      toast({
        title: "Error",
        description: "Failed to get responses from AI models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    query,
    responses,
    isLoading,
    consensusResponse,
    submitQuery
  };
};
