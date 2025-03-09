
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
    setResponses([]); // Clear previous responses
    
    try {
      console.log('=== SUBMITTING QUERY ===');
      console.log('Query text:', queryText);
      console.log('Available API keys:', Object.keys(apiKeys).filter(k => !!apiKeys[k]));
      
      // Fetch responses from all available LLMs
      const result = await fetchResponses(queryText, apiKeys);
      
      const { allResponses, derivedConsensus } = result;
      console.log('=== QUERY RESULTS RECEIVED ===');
      console.log(`Received ${allResponses.length} total responses`);
      console.log('Response sources:', allResponses.map(r => r.source).join(', '));
      
      // Set consensus response
      setConsensusResponse(derivedConsensus);
      
      if (allResponses.length === 0) {
        toast({
          title: "No Responses",
          description: "No AI models returned responses. Please check your API keys in settings.",
          variant: "destructive",
        });
      } else {
        // Verify responses based on consensus
        const verifiedResponses = verifyResponses(allResponses, derivedConsensus);
        console.log('Verified responses:', verifiedResponses.length);
        console.log('Verified response sources:', verifiedResponses.map(r => r.source).join(', '));
        
        // Store all responses
        setResponses(allResponses);
        console.log('All responses set in state:', allResponses.length);
        
        // Log individual model responses for debugging
        console.log('=== INDIVIDUAL RESPONSES DETAILS ===');
        allResponses.forEach((response, index) => {
          console.log(`Response #${index + 1}:`, {
            source: response.source,
            id: response.id,
            contentLength: response.content.length,
            contentSample: response.content.substring(0, 40) + '...',
            timestamp: response.timestamp
          });
        });

        // Save to database if user is logged in
        if (user) {
          await saveResponseToDatabase(user.id, queryText, derivedConsensus, verifiedResponses);
        }
        
        // Record on blockchain if private key is available
        if (privateKey) {
          await recordOnBlockchain(
            privateKey,
            user?.id || null,
            queryText,
            derivedConsensus,
            verifiedResponses
          );
        }
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
