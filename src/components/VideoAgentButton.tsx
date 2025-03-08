
import React from 'react';
import { VoiceVideoAgent } from './VoiceVideoAgent';
import AgentVeritasAvatar from './AgentVeritasAvatar';

const VideoAgentButton: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div id="video-agent-button">
        <VoiceVideoAgent initialMode="video" />
      </div>
    </div>
  );
};

export default VideoAgentButton;
