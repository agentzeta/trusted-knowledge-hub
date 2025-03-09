
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

// Import the components
import InitialModeSelection from './voice/InitialModeSelection';
import VideoModeChoice from './voice/VideoModeChoice';
import VoiceChatInterface from './voice/VoiceChatInterface';
import VideoRecordingInterface from './voice/VideoRecordingInterface';
import VideoPlaybackInterface from './voice/VideoPlaybackInterface';
import VoiceVideoAgentHeader from './voice/VoiceVideoAgentHeader';

// Import the custom hooks
import { useAgentInteraction } from '@/hooks/voice/useAgentInteraction';
import { useMediaRecording } from '@/hooks/voice/useMediaRecording';

interface VoiceVideoAgentProps {
  initialMode?: 'voice' | 'video';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const VoiceVideoAgent: React.FC<VoiceVideoAgentProps> = ({ 
  initialMode = 'voice',
  isOpen: propIsOpen,
  onOpenChange
}) => {
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  const { user } = useSupabaseAuth();
  
  const { 
    mode, 
    setMode,
    currentStep,
    setCurrentStep,
    agentResponding,
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    agentScript,
    processUserInput,
    handleVoiceMode,
    submitUserQuery
  } = useAgentInteraction(initialMode);

  const {
    isRecording,
    recordedVideo,
    videoRef,
    setupVideoStream,
    cleanupMedia,
    startRecording,
    stopRecording,
    setRecordedVideo,
    setRecordedChunks
  } = useMediaRecording();

  useEffect(() => {
    if (propIsOpen !== undefined) {
      setIsOpen(propIsOpen);
    }
  }, [propIsOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      cleanupMedia();
      setMode('initial');
      setCurrentStep(0);
      setRecordedChunks([]);
      setRecordedVideo(null);
      if (isListening) {
        stopListening();
      }
    } else {
      if (!isListening && !isSpeaking) {
        setTimeout(() => {
          startListening();
        }, 1000);
      }
      
      if (initialMode === 'video') {
        handleVideoMode();
      }
    }
  }, [isOpen, initialMode, isListening, isSpeaking]);

  useEffect(() => {
    if (isOpen && !isSpeaking && !agentResponding && agentScript[currentStep]) {
      speakResponse(agentScript[currentStep]);
    }
  }, [currentStep, isOpen, isSpeaking, agentResponding]);

  const handleVideoMode = async () => {
    setMode('video');
    setCurrentStep(2);
    const stream = await setupVideoStream();
    if (stream) {
      setMode('recording');
    }
  };

  const saveRecording = async () => {
    if (!recordedVideo || !user) return;
    
    toast({
      title: "Video Saved",
      description: "Your conversation with Agent Vera has been saved.",
    });
    
    handleOpenChange(false);
  };

  const speakResponse = async (text: string) => {
    // This is a passthrough to the hook's speakResponse
    await startListening();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <VoiceVideoAgentHeader mode={mode} isListening={isListening} />
          
          <AnimatePresence mode="wait">
            {mode === 'initial' && (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <InitialModeSelection 
                  agentScript={agentScript} 
                  isListening={isListening}
                  onModeSelect={(input) => {
                    const result = processUserInput(input);
                    if (result === 'close') {
                      handleOpenChange(false);
                    } else if (result === 'video') {
                      handleVideoMode();
                    }
                  }}
                />
              </motion.div>
            )}
            
            {mode === 'voice' && currentStep === 1 && (
              <motion.div 
                key="video-choice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VideoModeChoice 
                  agentScript={agentScript}
                  onModeSelect={(input) => {
                    const result = processUserInput(input);
                    if (result === 'video') {
                      handleVideoMode();
                    }
                  }}
                />
              </motion.div>
            )}
            
            {mode === 'voice' && currentStep === 2 && (
              <motion.div 
                key="voice-chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VoiceChatInterface 
                  agentScript={agentScript}
                  onSubmitQuery={(query) => {
                    const result = submitUserQuery(query);
                    if (result === 'close') {
                      setTimeout(() => handleOpenChange(false), 1000);
                    }
                  }}
                  onClose={() => setIsOpen(false)}
                  isLoading={agentResponding}
                  agentResponding={agentResponding}
                />
              </motion.div>
            )}
            
            {(mode === 'recording' || mode === 'video') && (
              <motion.div 
                key="video-recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VideoRecordingInterface 
                  agentScript={agentScript}
                  videoRef={videoRef}
                  isRecording={isRecording}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  onCancel={() => {
                    cleanupMedia();
                    setIsOpen(false);
                  }}
                  onSubmitQuery={(query) => {
                    const result = submitUserQuery(query);
                    if (result === 'close') {
                      setTimeout(() => handleOpenChange(false), 1000);
                    }
                  }}
                  isLoading={agentResponding}
                  agentResponding={agentResponding}
                />
              </motion.div>
            )}
            
            {mode === 'playback' && (
              <motion.div 
                key="video-playback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <VideoPlaybackInterface 
                  recordedVideo={recordedVideo}
                  onDiscard={() => {
                    setRecordedVideo(null);
                    setRecordedChunks([]);
                    setMode('recording');
                  }}
                  onSave={saveRecording}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

const VoiceVideoAgentDefault: React.FC = () => {
  return <VoiceVideoAgent initialMode="voice" />;
};

export default VoiceVideoAgentDefault;
