
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentMode } from '@/hooks/voice/useAgentInteraction';
import InitialModeSelection from './InitialModeSelection';
import VideoModeChoice from './VideoModeChoice';
import VoiceChatInterface from './VoiceChatInterface';
import VideoRecordingInterface from './VideoRecordingInterface';
import VideoPlaybackInterface from './VideoPlaybackInterface';

interface AgentModeRendererProps {
  mode: AgentMode;
  currentStep: number;
  agentScript: string[];
  agentResponding: boolean;
  isRecording: boolean;
  recordedVideo: string | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  isListening: boolean;
  onModeSelect: (input: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancel: () => void;
  onDiscard: () => void;
  onSave: () => void;
  onSubmitQuery: (query: string) => void;
  onClose: () => void;
}

const AgentModeRenderer: React.FC<AgentModeRendererProps> = ({
  mode,
  currentStep,
  agentScript,
  agentResponding,
  isRecording,
  recordedVideo,
  videoRef,
  isListening,
  onModeSelect,
  onStartRecording,
  onStopRecording,
  onCancel,
  onDiscard,
  onSave,
  onSubmitQuery,
  onClose
}) => {
  return (
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
            onModeSelect={onModeSelect}
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
            onModeSelect={onModeSelect}
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
            onSubmitQuery={onSubmitQuery}
            onClose={onClose}
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
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            onCancel={onCancel}
            onSubmitQuery={onSubmitQuery}
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
            onDiscard={onDiscard}
            onSave={onSave}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgentModeRenderer;
