
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <form onSubmit={handleSubmit} className="relative">
        <Input
          id="query-search-input"
          type="text"
          placeholder="Ask Truthful a question..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          className="pr-12 py-6 text-lg rounded-xl shadow-sm border-slate-200/70 dark:border-slate-700/70 focus:border-blue-300 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm"
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>
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
