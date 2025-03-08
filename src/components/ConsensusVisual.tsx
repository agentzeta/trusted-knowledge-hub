
import React from 'react';
import { motion } from 'framer-motion';
import { Response } from '../types/query';

interface ConsensusVisualProps {
  responses: Response[];
}

const ConsensusVisual: React.FC<ConsensusVisualProps> = ({ responses }) => {
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
      className="w-full max-w-md mx-auto mt-8 p-6 rounded-xl glass card-shadow"
    >
      <h3 className="text-center font-medium mb-4">AI Consensus Level</h3>
      
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
      
      <div className="mt-6 text-xs text-center text-gray-500">
        <p>Verification powered by Flare Data Connector</p>
      </div>
    </motion.div>
  );
};

export default ConsensusVisual;
