
import React from 'react';
import { X } from 'lucide-react';
import { DialogTitle, DialogHeader, DialogClose } from '@/components/ui/dialog';
import AgentVeritasAvatar from '../AgentVeritasAvatar';

interface VoiceVideoAgentHeaderProps {
  mode: 'initial' | 'voice' | 'video' | 'recording' | 'playback';
  isListening?: boolean;
}

const VoiceVideoAgentHeader: React.FC<VoiceVideoAgentHeaderProps> = ({ 
  mode, 
  isListening = false 
}) => {
  let title = 'Agent Vera';
  let subtitle = 'Your AI Assistant';
  
  if (mode === 'initial') {
    subtitle = 'Let me help you explore some facts today';
  } else if (mode === 'voice' || mode === 'video') {
    subtitle = isListening ? 'Listening...' : 'How can I help you?';
  } else if (mode === 'recording') {
    subtitle = 'Video conversation';
  } else if (mode === 'playback') {
    subtitle = 'Review your conversation';
  }
  
  return (
    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center bg-gradient-to-r from-slate-200 to-slate-300 rounded-full p-1 border border-slate-100 shadow-sm">
          <AgentVeritasAvatar 
            size="md" 
            withPulse={isListening}
          />
        </div>
        <div>
          <DialogTitle className="text-slate-800">{title}</DialogTitle>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <DialogClose className="rounded-full hover:bg-slate-100 p-1 text-slate-600">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </DialogHeader>
  );
};

export default VoiceVideoAgentHeader;
