
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Response } from '../types/query';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BarChart2 } from 'lucide-react';
import ConsensusScorecard from './consensus/ConsensusScorecard';
import ModelComparisonChart from './consensus/ModelComparisonChart';
import SimilarityMatrix from './consensus/SimilarityMatrix';
import ExplanationFooter from './consensus/ExplanationFooter';

interface ConsensusStatisticsProps {
  responses: Response[];
}

const ConsensusStatistics: React.FC<ConsensusStatisticsProps> = ({ responses }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (responses.length === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-6 p-6 rounded-xl glass card-shadow bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800"
    >
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Consensus Statistics</h3>
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
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                <ConsensusScorecard responses={responses} />
                <ModelComparisonChart responses={responses} />
              </div>
              
              <SimilarityMatrix responses={responses} />
              <ExplanationFooter />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ConsensusStatistics;
