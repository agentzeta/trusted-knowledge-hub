
import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Response } from '../types/query';
import LoadingIndicator from './query/LoadingIndicator';
import ConsensusResponse from './query/ConsensusResponse';
import IndividualResponses from './query/IndividualResponses';
import ConsensusVisual from './ConsensusVisual';
import ConsensusStatistics from './ConsensusStatistics';
import FollowUpQuestion from './query/FollowUpQuestion';
import { useQueryContext } from '../hooks/useQueryContext';

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
  // Get access to the submitQuery function
  const { submitQuery } = useQueryContext();

  // Get the timestamp from the first response (all responses have same timestamp)
  const timestamp = responses.length > 0 ? responses[0].timestamp : null;
  
  // Add detailed logging for debugging
  useEffect(() => {
    console.log('QueryResponses component rendering with:', {
      isLoading,
      hasConsensus: !!consensusResponse,
      responseCount: responses.length,
      responseSources: responses.map(r => r.source),
      responseDetails: responses.map(r => ({
        id: r.id,
        source: r.source,
        contentLength: r.content.length,
        contentPreview: r.content.substring(0, 50) + '...',
        verified: r.verified
      }))
    });
  }, [isLoading, consensusResponse, responses]);

  // Handle follow-up question submission
  const handleFollowUpSubmit = (question: string) => {
    submitQuery(question);
  };

  // If there are no responses and we're not loading, show a message
  if (responses.length === 0 && !isLoading && !consensusResponse) {
    return (
      <div className="mt-8 p-6 rounded-xl bg-white/80 shadow-md">
        <p className="text-center text-gray-500">
          No responses from any AI models. Please check your API keys in settings.
        </p>
      </div>
    );
  }

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
      
      {responses.length > 0 && !isLoading && (
        <FollowUpQuestion onSubmit={handleFollowUpSubmit} isLoading={isLoading} />
      )}
    </>
  );
};

export default QueryResponses;
