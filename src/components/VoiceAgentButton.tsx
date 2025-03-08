
import React from 'react';
import { VoiceVideoAgent } from './VoiceVideoAgent';
import VoiceAgentButtonUI from './voice/VoiceAgentButtonUI';
import { useVoiceButtonControl } from '@/hooks/useVoiceButtonControl';

const VoiceAgentButton: React.FC = () => {
  const {
    isDialogOpen,
    isListening,
    handleButtonClick,
    handleDialogOpenChange
  } = useVoiceButtonControl();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div id="voice-agent-button">
        <VoiceAgentButtonUI 
          isListening={isListening} 
          onClick={handleButtonClick}
        />
      </div>
      {isDialogOpen && (
        <VoiceVideoAgent 
          initialMode="voice" 
          isOpen={isDialogOpen} 
          onOpenChange={handleDialogOpenChange}
        />
      )}
    </div>
  );
};

export default VoiceAgentButton;
