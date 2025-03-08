
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AgentVeritasAvatar from '../AgentVeritasAvatar';

interface VoiceVideoAgentHeaderProps {
  mode: 'initial' | 'voice' | 'video' | 'recording' | 'playback';
  isListening: boolean;
}

const VoiceVideoAgentHeader: React.FC<VoiceVideoAgentHeaderProps> = ({
  mode,
  isListening
}) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-center flex items-center justify-center gap-2">
        <AgentVeritasAvatar size="sm" />
        <span>
          {mode === 'initial' && "Agent Veritas"}
          {mode === 'voice' && "Voice Chat with Agent Veritas"}
          {(mode === 'video' || mode === 'recording') && "Video Chat with Agent Veritas"}
          {mode === 'playback' && "Review Your Recording"}
        </span>
        {isListening && (
          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full animate-pulse">
            Listening...
          </span>
        )}
      </DialogTitle>
    </DialogHeader>
  );
};

export default VoiceVideoAgentHeader;
