
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExplanationHeaderProps {
  isExpanded: boolean;
  toggleExpand: () => void;
  title: string;
}

const ExplanationHeader: React.FC<ExplanationHeaderProps> = ({ 
  isExpanded, 
  toggleExpand,
  title
}) => {
  return (
    <div 
      className="flex justify-between items-center cursor-pointer" 
      onClick={toggleExpand}
    >
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-auto"
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand();
        }}
      >
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default ExplanationHeader;
