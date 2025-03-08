
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryContext } from '../context/QueryContext';
import { Search } from 'lucide-react';

const QueryInterface: React.FC = () => {
  const { submitQuery, isLoading } = useQueryContext();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      submitQuery(query.trim());
    }
  };

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question to verify with AI consensus..."
            className="block w-full bg-transparent border-0 py-4 pl-12 pr-24 text-sm sm:text-base focus:ring-0 focus:outline-none placeholder:text-gray-400"
            disabled={isLoading}
          />
          
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading || !query.trim()}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl ${
                isLoading || !query.trim()
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
    </motion.div>
  );
};

export default QueryInterface;
