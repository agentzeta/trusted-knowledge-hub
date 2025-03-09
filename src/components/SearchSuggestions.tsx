
import React from 'react';
import { Search } from 'lucide-react';

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
    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border border-slate-200 dark:bg-slate-900 dark:border-slate-700">
      <ul className="py-1">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            onClick={() => {
              onSuggestionClick(suggestion.query);
              if (setShowSuggestions) setShowSuggestions(false);
            }}
            className="px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center cursor-pointer transition-colors"
          >
            <Search className="h-4 w-4 text-slate-400 mr-2" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{suggestion.query}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
