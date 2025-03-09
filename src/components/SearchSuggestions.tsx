
import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchSuggestion {
  id: string | number;
  query: string;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSuggestionClick: (query: string) => void;
  isVisible: boolean;
  setShowSuggestions?: (show: boolean) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  isVisible,
  setShowSuggestions
}) => {
  if (!isVisible || suggestions.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="absolute z-10 mt-1 w-full rounded-md bg-white dark:bg-slate-900 shadow-lg max-h-60 overflow-auto border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
    >
      <ul className="py-1">
        {suggestions.map((suggestion) => (
          <motion.li
            key={suggestion.id}
            whileHover={{ backgroundColor: 'rgba(241, 245, 249, 0.6)' }}
            onClick={() => {
              onSuggestionClick(suggestion.query);
              if (setShowSuggestions) setShowSuggestions(false);
            }}
            className="px-4 py-2.5 flex items-center cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-2.5 flex-shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">{suggestion.query}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default SearchSuggestions;
