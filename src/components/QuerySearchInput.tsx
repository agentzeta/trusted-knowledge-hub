
import React, { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQueryContext } from '@/hooks/useQueryContext';
import { motion, AnimatePresence } from 'framer-motion';
import SearchSuggestions from './SearchSuggestions';

interface QuerySearchInputProps {
  inputQuery: string;
  setInputQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  suggestions: Array<{ id: number; query: string }>;
  showSuggestions: boolean;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { cancelQuery } = useQueryContext();

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleCancel = () => {
    cancelQuery();
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </div>
          <Input
            id="query-search-input"
            ref={inputRef}
            type="text"
            className="w-full pl-10 pr-4 h-12 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90"
            placeholder="Ask any question..."
            value={inputQuery}
            onChange={(e) => {
              setInputQuery(e.target.value);
              if (!e.target.value) {
                setShowSuggestions(false);
              }
            }}
            onFocus={() => {
              if (inputQuery.trim() && inputQuery.length > 2) {
                setShowSuggestions(true);
              }
            }}
          />
          {inputQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setInputQuery('')}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="cancel-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                type="button" 
                className="h-12 px-6 bg-red-500 hover:bg-red-600"
                onClick={handleCancel}
              >
                <X className="mr-2 h-5 w-5" />
                Stop
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="submit-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button type="submit" className="h-12 px-6" disabled={!inputQuery.trim()}>
                Submit
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <SearchSuggestions
            suggestions={suggestions}
            onSelect={handleSuggestionClick}
            isVisible={showSuggestions}
            onClose={() => setShowSuggestions(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuerySearchInput;
