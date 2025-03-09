
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Response } from '../../types/query';

interface IndividualResponsesProps {
  responses: Response[];
}

const IndividualResponses: React.FC<IndividualResponsesProps> = ({ responses }) => {
  useEffect(() => {
    console.log('IndividualResponses rendering with:', {
      count: responses.length, 
      sources: responses.map(r => r.source).join(', '),
      responseIds: responses.map(r => r.id)
    });
  }, [responses]);
  
  if (responses.length === 0) {
    console.log('No responses to display in IndividualResponses');
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6 rounded-xl glass card-shadow"
    >
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Individual AI Responses ({responses.length}):</h3>
        <div className="space-y-4">
          {responses.map((response) => (
            <div 
              key={response.id} 
              className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">{response.source}</span>
                <span className={response.verified ? 
                  "text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100" : 
                  "text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100"}>
                  {response.verified ? 'Verified' : 'Divergent'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{response.content}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default IndividualResponses;
