
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MessageSquare } from 'lucide-react';
import AgentVeritasAvatar from '../AgentVeritasAvatar';

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
    ? "rounded-full bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300" 
    : "rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:shadow-md border border-blue-400 transition-all duration-300";
  
  return (
    <Button
      className={`${defaultClass} ${className} flex items-center gap-2`}
      size={label ? "default" : "icon"}
      onClick={onClick}
    >
      {type === 'voice' ? (
        isListening ? 
          <Mic className="h-5 w-5 animate-pulse text-blue-600" /> : 
          <AgentVeritasAvatar size="sm" />
      ) : (
        <MessageSquare className="h-5 w-5" />
      )}
      {label && <span>{label}</span>}
    </Button>
  );
};

export default VoiceAgentButtonUI;
