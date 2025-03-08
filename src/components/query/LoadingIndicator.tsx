
import React from 'react';
import { motion } from 'framer-motion';

const LoadingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="mt-6 text-center text-sm text-gray-500"
    >
      <div className="flex flex-col items-center space-y-2">
        <p>Consulting multiple AI models...</p>
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '300ms' }} />
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '600ms' }} />
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingIndicator;
