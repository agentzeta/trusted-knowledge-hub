
import React from 'react';
import { VoiceVideoAgent } from './VoiceVideoAgent';
import AgentVeritasAvatar from './AgentVeritasAvatar';

const VoiceAgentButton: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div id="voice-agent-button">
        <VoiceVideoAgent />
      </div>
    </div>
  );
};

export default VoiceAgentButton;
