
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, Send, StopCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import SearchSuggestions from './SearchSuggestions';

interface QuerySearchInputProps {
  inputQuery: string;
  setInputQuery: (query: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  suggestions: Array<{ id: number; query: string }>;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  handleSuggestionClick: (query: string) => void;
  handleStop?: () => void;
}

const QuerySearchInput: React.FC<QuerySearchInputProps> = ({
  inputQuery,
  setInputQuery,
  handleSubmit,
  isLoading,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  handleSuggestionClick,
  handleStop
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <form onSubmit={handleSubmit} className="relative flex">
        <Input
          id="query-search-input"
          type="text"
          placeholder="Ask Truthful a question..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="pr-24 py-6 text-lg rounded-lg shadow-sm border-gray-200"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
          {isLoading ? (
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={handleStop}
              title="Stop query"
            >
              <StopCircle className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !inputQuery.trim()}
              title="Submit query"
            >
              <Send className="h-5 w-5" />
            </Button>
          )}
        </div>
      </form>
      
      <SearchSuggestions
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
        isVisible={showSuggestions}
        setShowSuggestions={setShowSuggestions}
      />
    </motion.div>
  );
};

export default QuerySearchInput;
