
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
  let title = 'Agent Veritas';
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
        <div className="flex items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-600 rounded-full p-1">
          <AgentVeritasAvatar 
            size="md" 
            withPulse={isListening}
          />
        </div>
        <div>
          <DialogTitle>{title}</DialogTitle>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <DialogClose className="rounded-full hover:bg-gray-100 p-1">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </DialogHeader>
  );
};

export default VoiceVideoAgentHeader;
