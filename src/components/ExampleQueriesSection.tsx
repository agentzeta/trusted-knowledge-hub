
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Microscope, History, Stethoscope, Cpu, BrainCircuit, Atom, Landmark, FlaskConical, Globe } from 'lucide-react';

// Expanded example queries by category with more specific, interesting questions
const exampleQueries = {
  science: [
    { id: 'sci-1', query: "What escape velocity can a space shuttle not exceed when orbiting earth, on its trajectory to Mars?", icon: <FlaskConical className="h-3 w-3" /> },
    { id: 'sci-2', query: "How do black holes evaporate according to Hawking radiation?", icon: <Atom className="h-3 w-3" /> },
    { id: 'sci-3', query: "What causes the northern lights and where are they most visible?", icon: <Globe className="h-3 w-3" /> }
  ],
  history: [
    { id: 'hist-1', query: "Who built the Great Wall of China and how long did it take?", icon: <History className="h-3 w-3" /> },
    { id: 'hist-2', query: "What factors led to the fall of the Roman Empire?", icon: <Landmark className="h-3 w-3" /> }
  ],
  politics: [
    { id: 'pol-1', query: "How does the Electoral College work in the United States?", icon: <Landmark className="h-3 w-3" /> },
    { id: 'pol-2', query: "What were the key provisions of the Paris Climate Agreement?", icon: <Globe className="h-3 w-3" /> }
  ],
  health: [
    { id: 'health-1', query: "Is coffee good for your health based on recent studies?", icon: <Stethoscope className="h-3 w-3" /> },
    { id: 'health-2', query: "How do mRNA vaccines work compared to traditional vaccines?", icon: <Stethoscope className="h-3 w-3" /> }
  ],
  technology: [
    { id: 'tech-1', query: "How do neural networks work and what are their limitations?", icon: <Cpu className="h-3 w-3" /> },
    { id: 'tech-2', query: "What are the key differences between quantum computing and classical computing?", icon: <Cpu className="h-3 w-3" /> },
    { id: 'tech-3', query: "What events are inflection points in evolution of AI industry?", icon: <BrainCircuit className="h-3 w-3" /> }
  ],
  ai: [
    { id: 'ai-1', query: "How does consensus learning in AI improve factual accuracy?", icon: <BrainCircuit className="h-3 w-3" /> },
    { id: 'ai-2', query: "How are large language models trained and what data do they use?", icon: <Book className="h-3 w-3" /> }
  ],
  blockchain: [
    { id: 'blockchain-1', query: "How does Flare Network's approach to data oracles differ from Chainlink?", icon: <Cpu className="h-3 w-3" /> },
    { id: 'blockchain-2', query: "What is the purpose of the FTSO system in the Flare ecosystem?", icon: <Cpu className="h-3 w-3" /> }
  ]
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
    <div className="mt-4 mb-8">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">Try an example query:</p>
      <div className="space-y-4">
        {Object.entries(exampleQueries).map(([category, queries]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {queries.map((queryItem) => (
                <motion.button
                  key={queryItem.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onExampleClick(queryItem.query)}
                  className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 
                    backdrop-blur-sm rounded-full border border-slate-200/50 dark:border-slate-700/50 
                    text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
                  disabled={isLoading}
                >
                  {queryItem.icon}
                  <span className="truncate max-w-[200px]">{queryItem.query}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExampleQueriesSection;
