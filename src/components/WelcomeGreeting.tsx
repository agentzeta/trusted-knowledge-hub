
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AgentVeritasAvatar from './AgentVeritasAvatar';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import VoiceAgentButtonUI from './voice/VoiceAgentButtonUI';

interface WelcomeGreetingProps {
  onChooseTextChat: () => void;
  onChooseVoiceChat: () => void;
  onChooseVideoChat: () => void;
}

const WelcomeGreeting: React.FC<WelcomeGreetingProps> = ({ 
  onChooseTextChat,
  onChooseVoiceChat,
  onChooseVideoChat
}) => {
  const [expanded, setExpanded] = useState(false);
  const { speakResponse, isSpeaking } = useVoiceAgent();
  
  const handleExpandClick = () => {
    if (!expanded) {
      speakResponse("Hello, would you rather speak to our Agent, or use text in the chat?");
      setExpanded(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-3" onClick={handleExpandClick}>
          <AgentVeritasAvatar withPulse={!expanded} />
          <div className="flex-1">
            <h3 className="text-lg font-medium">Hello from Agent Veritas</h3>
            <p className="text-gray-500">Would you rather speak to our Agent, or use text in the chat?</p>
          </div>
          <div className="flex gap-2">
            <VoiceAgentButtonUI 
              type="voice" 
              label="Activate Voice Agent" 
              onClick={onChooseVoiceChat}
              className="text-sm"
            />
            <VoiceAgentButtonUI 
              type="chat" 
              label="Activate Chat Agent" 
              onClick={onChooseTextChat}
              className="text-sm"
            />
          </div>
        </div>
        
        {expanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={onChooseTextChat}
              >
                <MessageSquare size={16} />
                Text Chat
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={onChooseVoiceChat}
              >
                <Mic size={16} />
                Voice Chat
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={onChooseVideoChat}
              >
                <Video size={16} />
                Video Chat
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WelcomeGreeting;
