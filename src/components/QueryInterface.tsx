
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryContext } from '../context/QueryContext';
import { Search } from 'lucide-react';

const QueryInterface: React.FC = () => {
  const { submitQuery, isLoading, query, responses } = useQueryContext();
  const [inputQuery, setInputQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      submitQuery(inputQuery.trim());
    }
  };

  // Get the primary response (most verified or highest confidence)
  const getPrimaryResponse = () => {
    if (!responses.length) return null;
    
    const sortedResponses = [...responses].sort((a, b) => {
      if (a.verified === b.verified) {
        return b.confidence - a.confidence;
      }
      return a.verified ? -1 : 1;
    });
    
    return sortedResponses[0];
  };
  
  const primaryResponse = getPrimaryResponse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <div className="relative card-shadow hover-card-shadow rounded-2xl glass p-1 transition-all duration-300">
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question to verify with AI consensus..."
            className="block w-full bg-transparent border-0 py-4 pl-12 pr-24 text-sm sm:text-base focus:ring-0 focus:outline-none placeholder:text-gray-400"
            disabled={isLoading}
          />
          
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl ${
                isLoading || !inputQuery.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors duration-300`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                  <span>Verifying</span>
                </div>
              ) : (
                'Verify'
              )}
            </motion.button>
          </div>
        </form>
      </div>
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            <div className="flex flex-col items-center space-y-2">
              <p>Consulting multiple AI models for verification...</p>
              <div className="flex space-x-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '600ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {responses.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-xl glass card-shadow"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Verified Answer:</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 text-lg">{primaryResponse?.content}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-sm text-gray-500">
              <span>Source: {primaryResponse?.source}</span>
              <span className="mx-2">•</span>
              <span className={primaryResponse?.verified ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                {primaryResponse?.verified ? 'Verified' : 'Pending verification'}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">All AI Model Responses:</h3>
            <div className="space-y-4">
              {responses.map((response, idx) => (
                <div key={response.id} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{response.source}</span>
                    <span className={response.verified ? "text-xs px-2 py-1 rounded-full bg-green-50 text-green-600" : "text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600"}>
                      {response.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{response.content}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QueryInterface;
