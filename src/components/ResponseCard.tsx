
import React from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { Response } from '../types/query';

interface ResponseCardProps {
  response: Response;
  index: number;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ response, index }) => {
  const delayBase = 0.1;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delayBase + index * 0.1 }}
      className="w-full p-6 rounded-xl glass card-shadow hover-card-shadow transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
            <span className="text-blue-600 font-medium">{response.source.charAt(0)}</span>
          </div>
          <h3 className="font-medium">{response.source}</h3>
        </div>
        
        <VerificationBadge verified={response.verified} />
      </div>
      
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 dark:text-gray-300">{response.content}</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center text-xs text-gray-500">
          {response.verified ? (
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-1" />
              <span>Verified by Flare Data Connector</span>
            </div>
          ) : (
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 text-amber-500 mr-1" />
              <span>Pending verification</span>
            </div>
          )}
          
          <span className="mx-2">•</span>
          <span>{new Date(response.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ResponseCard;
