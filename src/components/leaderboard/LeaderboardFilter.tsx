
import React from 'react';
import { Button } from '@/components/ui/button';

interface LeaderboardFilterProps {
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
}

const LeaderboardFilter: React.FC<LeaderboardFilterProps> = ({
  onCategoryChange,
  selectedCategory
}) => {
  // Model categories
  const categories = [
    { id: 'all', label: 'All Models' },
    { id: 'claude', label: 'Claude' },
    { id: 'gpt', label: 'GPT' },
    { id: 'gemini', label: 'Gemini' },
    { id: 'llama', label: 'Llama' },
    { id: 'mistral', label: 'Mistral' },
    { id: 'perplexity', label: 'Perplexity' }
  ];
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="text-xs"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
};

export default LeaderboardFilter;
