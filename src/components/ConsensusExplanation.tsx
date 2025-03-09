
import React from 'react';
import { motion } from 'framer-motion';
import { Response } from '../types/query';
import { generateConsensusExplanation } from '../utils/consensusUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';

interface ConsensusExplanationProps {
  responses: Response[];
}

const ConsensusExplanation: React.FC<ConsensusExplanationProps> = ({ responses }) => {
  if (responses.length === 0) return null;
  
  const verifiedCount = responses.filter(r => r.verified).length;
  const consensusPercentage = responses.length > 0 ? verifiedCount / responses.length : 0;
  const consensusConfidence = consensusPercentage * 0.7 + 0.3; // Simple formula for demonstration
  
  const explanation = generateConsensusExplanation(
    responses,
    verifiedCount,
    consensusConfidence
  );
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-4"
    >
      <div className="bg-white/90 p-6 rounded-xl shadow-sm border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <InfoIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Consensus Explanation</h3>
        </div>
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-line text-gray-700">{explanation}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsensusExplanation;
