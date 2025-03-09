
import React from 'react';
import { Search } from 'lucide-react';

interface SearchSuggestion {
  id: string | number;
  query: string;
}

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  onSelect?: (query: string) => void;
  onSuggestionClick?: (query: string) => void;
  isVisible?: boolean;
  onClose?: () => void;
  setShowSuggestions?: (show: boolean) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSelect,
  onSuggestionClick,
  isVisible = true,
  onClose,
  setShowSuggestions
}) => {
  if (!isVisible || suggestions.length === 0) return null;

  const handleSuggestionClick = (query: string) => {
    // Call both handlers for backward compatibility
    if (onSelect) onSelect(query);
    if (onSuggestionClick) onSuggestionClick(query);
    
    // Handle closing suggestions
    if (onClose) onClose();
    if (setShowSuggestions) setShowSuggestions(false);
  };

  return (
    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto glass card-shadow">
      <ul className="py-1">
        {suggestions.map((suggestion) => (
          <li
            key={suggestion.id}
            onClick={() => handleSuggestionClick(suggestion.query)}
            className="px-4 py-2 hover:bg-blue-50 flex items-center cursor-pointer transition-colors"
          >
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm">{suggestion.query}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;
