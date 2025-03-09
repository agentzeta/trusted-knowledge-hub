
import React from 'react';
import { motion } from 'framer-motion';

// Example queries by category
const exampleQueries = {
  science: "What causes northern lights?",
  history: "Who built the Great Wall of China?",
  politics: "How does the Electoral College work?",
  health: "Is coffee good for your health?",
  technology: "How do neural networks work?",
  ai: "What events are inflection points in evolution of AI industry?"
};

interface ExampleQueriesSectionProps {
  onExampleClick: (query: string) => void;
  isLoading: boolean;
}

const ExampleQueriesSection: React.FC<ExampleQueriesSectionProps> = ({ 
  onExampleClick, 
  isLoading 
}) => {
  return (
    <div className="mt-4 mb-6">
      <p className="text-sm text-slate-500 mb-2">Try an example query:</p>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-2"
      >
        {Object.entries(exampleQueries).map(([category, queryText]) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onExampleClick(queryText)}
            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50 text-slate-700 dark:text-slate-200 transition-all"
            disabled={isLoading}
          >
            {category}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default ExampleQueriesSection;
