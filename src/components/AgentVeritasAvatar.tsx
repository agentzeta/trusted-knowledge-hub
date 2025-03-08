
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

interface AgentVeritasAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  withPulse?: boolean;
}

const AgentVeritasAvatar: React.FC<AgentVeritasAvatarProps> = ({ 
  size = 'md',
  withPulse = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg`}
    >
      <Bot className={`text-white ${iconSizes[size]}`} />
      
      {withPulse && (
        <span className="absolute top-0 right-0 h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      )}
    </motion.div>
  );
};

export default AgentVeritasAvatar;
