
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Response } from '../../types/query';

interface IndividualResponsesProps {
  responses: Response[];
}

const IndividualResponses: React.FC<IndividualResponsesProps> = ({ responses }) => {
  useEffect(() => {
    console.log('IndividualResponses MOUNT with:', {
      count: responses.length, 
      sources: responses.map(r => r.source).join(', '),
      responseIds: responses.map(r => r.id)
    });
    
    // Log each response in detail
    responses.forEach((response, index) => {
      console.log(`Response #${index + 1} from ${response.source}:`, {
        id: response.id,
        contentLength: response.content.length,
        contentPreview: response.content.substring(0, 50) + '...',
        verified: response.verified,
        timestamp: response.timestamp
      });
    });
    
    return () => {
      console.log('IndividualResponses UNMOUNT');
    };
  }, [responses]);
  
  // Additional log on every render
  console.log('IndividualResponses RENDER with responses:', responses.length);
  
  if (responses.length === 0) {
    console.log('No responses to display in IndividualResponses');
    return null;
  }
  
  // Sort responses alphabetically by source name for consistent display
  const sortedResponses = [...responses].sort((a, b) => a.source.localeCompare(b.source));
  
  // Group responses by type (OpenRouter vs Direct API)
  const openRouterResponses = sortedResponses.filter(r => 
    r.source.includes('Claude') || 
    r.source.includes('Llama') || 
    r.source.includes('Mistral') ||
    r.source.includes('DeepSeek') ||
    r.source.includes('Cohere') ||
    r.source.includes('Sonar') ||
    r.source.includes('Gemini 1.5 Pro (OpenRouter)')
  );
  
  const otherResponses = sortedResponses.filter(r => 
    !r.source.includes('Claude') && 
    !r.source.includes('Llama') && 
    !r.source.includes('Mistral') &&
    !r.source.includes('DeepSeek') &&
    !r.source.includes('Cohere') &&
    !r.source.includes('Sonar') &&
    !r.source.includes('Gemini 1.5 Pro (OpenRouter)')
  );
  
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
        
        {openRouterResponses.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium mb-2 text-blue-600">OpenRouter Models ({openRouterResponses.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {openRouterResponses.map((response) => (
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
        )}
        
        {otherResponses.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2 text-green-600">Direct API Models ({otherResponses.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otherResponses.map((response) => (
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
        )}
      </div>
    </motion.div>
  );
};

export default IndividualResponses;
