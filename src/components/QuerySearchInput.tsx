
import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchSuggestions from './SearchSuggestions';
import useClickOutside from '../hooks/useClickOutside';

interface QuerySearchInputProps {
  inputQuery: string;
  setInputQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  suggestions: Array<{id: number | string, query: string}>;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSuggestionClick: (query: string) => void;
}

const QuerySearchInput: React.FC<QuerySearchInputProps> = ({
  inputQuery,
  setInputQuery,
  handleSubmit,
  isLoading,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  handleSuggestionClick
}) => {
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchContainerRef, () => {
    setShowSuggestions(false);
  });

  const handleInputFocus = () => {
    if (inputQuery.trim().length > 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="relative card-shadow hover-card-shadow rounded-2xl glass p-1 transition-all duration-300" ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onFocus={handleInputFocus}
          placeholder="Ask any question to get AI consensus..."
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
                <span>Getting Answers</span>
              </div>
            ) : (
              'Get Answer'
            )}
          </motion.button>
        </div>
      </form>
      
      <SearchSuggestions 
        suggestions={suggestions} 
        onSuggestionClick={handleSuggestionClick} 
        isVisible={showSuggestions}
      />
    </div>
  );
};

export default QuerySearchInput;
