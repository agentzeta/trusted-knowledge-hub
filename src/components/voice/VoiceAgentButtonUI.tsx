
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MessageSquare } from 'lucide-react';
import AgentVeritasAvatar from '../AgentVeritasAvatar';
import { motion } from 'framer-motion';

interface VoiceAgentButtonUIProps {
  isListening?: boolean;
  onClick: () => void;
  type?: 'voice' | 'chat';
  label?: string;
  className?: string;
}

const VoiceAgentButtonUI: React.FC<VoiceAgentButtonUIProps> = ({
  isListening = false,
  onClick,
  type = 'voice',
  label,
  className = ""
}) => {
  // More elegant, professional Apple-style color schemes
  const defaultClass = type === 'voice' 
    ? "rounded-full bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 dark:from-slate-800 dark:to-slate-900 dark:text-slate-200 shadow-sm hover:shadow-md border border-slate-200/50 dark:border-slate-700/30 transition-all duration-300" 
    : "rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md border border-blue-400/30 transition-all duration-300";
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        className={`${defaultClass} ${className} flex items-center gap-2`}
        size={label ? "default" : "icon"}
        onClick={onClick}
      >
        {type === 'voice' ? (
          isListening ? 
            <Mic className="h-5 w-5 animate-pulse text-blue-600 dark:text-blue-400" /> : 
            <AgentVeritasAvatar size="sm" />
        ) : (
          <MessageSquare className="h-5 w-5" />
        )}
        {label && <span className="font-medium">{label}</span>}
      </Button>
    </motion.div>
  );
};

export default VoiceAgentButtonUI;
