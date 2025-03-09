
import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Response } from '../types/query';
import LoadingIndicator from './query/LoadingIndicator';
import ConsensusResponse from './query/ConsensusResponse';
import IndividualResponses from './query/IndividualResponses';
import ConsensusVisual from './ConsensusVisual';
import ConsensusStatistics from './ConsensusStatistics';

interface QueryResponsesProps {
  isLoading: boolean;
  consensusResponse: string | null;
  responses: Response[];
}

const QueryResponses: React.FC<QueryResponsesProps> = ({
  isLoading,
  consensusResponse,
  responses
}) => {
  // Get the timestamp from the first response (all responses have same timestamp)
  const timestamp = responses.length > 0 ? responses[0].timestamp : null;
  
  useEffect(() => {
    console.log('QueryResponses component rendering with:', {
      isLoading,
      hasConsensus: !!consensusResponse,
      responseCount: responses.length,
      responseSources: responses.map(r => r.source)
    });
  }, [isLoading, consensusResponse, responses]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingIndicator />}
      </AnimatePresence>
      
      {consensusResponse && !isLoading && (
        <ConsensusResponse 
          consensusResponse={consensusResponse} 
          timestamp={timestamp} 
        />
      )}
      
      {responses.length > 1 && !isLoading && (
        <ConsensusVisual responses={responses} />
      )}
      
      {responses.length > 0 && !isLoading && (
        <IndividualResponses responses={responses} />
      )}
      
      {responses.length > 1 && !isLoading && (
        <ConsensusStatistics responses={responses} />
      )}
    </>
  );
};

export default QueryResponses;
