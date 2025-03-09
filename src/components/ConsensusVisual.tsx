
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Response } from '../types/query';
import { ChevronDown, ChevronUp, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConsensusVisualProps {
  responses: Response[];
}

const ConsensusVisual: React.FC<ConsensusVisualProps> = ({ responses }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const verifiedCount = responses.filter(r => r.verified).length;
  const totalCount = responses.length;
  const consensusPercentage = totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0;
  
  const getConsensusLevel = () => {
    if (consensusPercentage >= 80) return { label: 'Strong Consensus', color: 'bg-green-500' };
    if (consensusPercentage >= 60) return { label: 'Moderate Consensus', color: 'bg-blue-500' };
    if (consensusPercentage >= 40) return { label: 'Weak Consensus', color: 'bg-amber-500' };
    return { label: 'No Consensus', color: 'bg-red-500' };
  };
  
  const consensusLevel = getConsensusLevel();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800"
    >
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">AI Consensus Level</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-1 h-auto"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="mt-4">
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${consensusPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`absolute top-0 left-0 h-full ${consensusLevel.color}`}
          />
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm font-medium">{consensusLevel.label}</p>
          <p className="text-sm font-medium">{Math.round(consensusPercentage)}% ({verifiedCount}/{totalCount} verified)</p>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-medium mb-2">What This Means</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {consensusPercentage >= 80 ? (
                  "Most AI models strongly agree on this answer, indicating high reliability."
                ) : consensusPercentage >= 60 ? (
                  "A majority of AI models agree on this answer, showing good confidence."
                ) : consensusPercentage >= 40 ? (
                  "Some AI models agree, but there is notable disagreement indicating potential uncertainty."
                ) : (
                  "AI models largely disagree on this answer, suggesting high uncertainty."
                )}
              </p>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                <p>Verification powered by Flare Data Connector</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConsensusVisual;
