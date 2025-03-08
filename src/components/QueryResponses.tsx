
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Response } from '../types/query';
import { format } from 'date-fns';

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
  const formattedDate = timestamp 
    ? format(new Date(timestamp * 1000), 'MMM d, yyyy h:mm a') 
    : null;

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            <div className="flex flex-col items-center space-y-2">
              <p>Consulting multiple AI models...</p>
              <div className="flex space-x-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '600ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {consensusResponse && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-xl glass card-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">AI Response:</h2>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Multi-Model Consensus
              </span>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-line">{consensusResponse}</p>
              
              {formattedDate && (
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    Generated on {formattedDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {responses.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 rounded-xl glass card-shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Individual AI Responses:</h3>
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{response.source}</span>
                    <span className={response.verified ? "text-xs px-2 py-1 rounded-full bg-green-50 text-green-600" : "text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600"}>
                      {response.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{response.content}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default QueryResponses;
