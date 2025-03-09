
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Video, Shield } from 'lucide-react';
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
  
  useEffect(() => {
    // Automatically speak a greeting when the component is mounted
    if (!isSpeaking) {
      speakResponse("Hello from Agent Vera. Would you rather speak to me, or use text in the chat?");
    }
  }, []);

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
      className="mb-8 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden professional-card"
    >
      <div className="p-4">
        <div className="flex items-center gap-3" onClick={handleExpandClick}>
          <div className="flex items-center justify-center bg-gradient-to-r from-slate-700 to-slate-900 rounded-full w-10 h-10">
            <AgentVeritasAvatar withPulse={!expanded} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium">Hello from Agent Vera</h3>
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
                className="flex items-center gap-2 apple-button"
                onClick={onChooseTextChat}
              >
                <MessageSquare size={16} />
                Text Chat
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 apple-button"
                onClick={onChooseVoiceChat}
              >
                <Mic size={16} />
                Voice Chat
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 apple-button"
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
