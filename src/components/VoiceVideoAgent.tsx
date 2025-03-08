
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useQueryContext } from '@/hooks/useQueryContext';
import { toast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

// Import the newly created components
import InitialModeSelection from './voice/InitialModeSelection';
import VideoModeChoice from './voice/VideoModeChoice';
import VoiceChatInterface from './voice/VoiceChatInterface';
import VideoRecordingInterface from './voice/VideoRecordingInterface';
import VideoPlaybackInterface from './voice/VideoPlaybackInterface';
import VoiceVideoAgentHeader from './voice/VoiceVideoAgentHeader';

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
  const [mode, setMode] = useState<'initial' | 'voice' | 'video' | 'recording' | 'playback'>('initial');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [agentResponding, setAgentResponding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { 
    speakResponse, 
    isSpeaking, 
    stopSpeaking, 
    startListening, 
    stopListening, 
    isListening 
  } = useVoiceAgent();
  const { consensusResponse, submitQuery, isLoading } = useQueryContext();
  const { user } = useSupabaseAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const agentScript = [
    "Hello! Would you rather speak to our Agent or use text in the chat?",
    "Would you like to speak to Agent Veritas through video, so the agent can see you and your background, or just voice is enough?",
    "Welcome to Truthful, I'm Agent Veritas. I'm here to help provide verified information from multiple AI models. What field do you have questions about today?"
  ];

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
      setUserInput('');
      setAgentResponding(false);
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
        setMode('video');
        setCurrentStep(1);
        handleVideoMode();
      } else if (initialMode === 'voice') {
        setMode('voice');
        setCurrentStep(1);
      }
    }
  }, [isOpen, initialMode, isListening, isSpeaking]);

  useEffect(() => {
    if (isOpen && !isSpeaking && !agentResponding && agentScript[currentStep]) {
      speakResponse(agentScript[currentStep]);
    }
  }, [currentStep, isOpen, isSpeaking, agentResponding]);

  const setupVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera Access Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      });
      return null;
    }
  };

  const cleanupMedia = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsRecording(false);
  };

  const processUserInput = (input: string) => {
    const normalizedInput = input.trim().toLowerCase();
    console.log('Processing user input:', normalizedInput);
    
    if (currentStep === 0) {
      if (normalizedInput.includes('speak') || 
          normalizedInput.includes('agent') || 
          normalizedInput.includes('voice') || 
          normalizedInput.includes('talk')) {
        console.log('User chose to speak to agent');
        setCurrentStep(1);
        setMode('voice');
      } else if (normalizedInput.includes('text') || 
                normalizedInput.includes('chat') || 
                normalizedInput.includes('type')) {
        console.log('User chose text chat');
        submitUserQuery(input);
        handleOpenChange(false);
      } else {
        setAgentResponding(true);
        speakResponse("I'm not sure if you want to speak to an agent or use text chat. Please clarify by saying 'speak to agent' or 'use text chat'.");
        setAgentResponding(false);
      }
    } 
    else if (currentStep === 1) {
      if (normalizedInput.includes('video')) {
        console.log('User chose video mode');
        handleVideoMode();
      } else if (normalizedInput.includes('voice') || 
                normalizedInput.includes('audio') || 
                normalizedInput.includes('just voice') || 
                normalizedInput.includes('enough')) {
        console.log('User chose voice mode');
        handleVoiceMode();
      } else {
        setAgentResponding(true);
        speakResponse("I'm not sure if you want video or just voice. Please clarify by saying 'use video' or 'just voice'.");
        setAgentResponding(false);
      }
    }
    else if (currentStep === 2) {
      console.log('Processing query:', normalizedInput);
      submitUserQuery(input);
    }
  };

  const handleVoiceMode = () => {
    setMode('voice');
    setCurrentStep(2); // Skip to introduction
    speakResponse(agentScript[2]);
  };

  const handleVideoMode = async () => {
    setMode('video');
    setCurrentStep(2);
    const stream = await setupVideoStream();
    if (stream) {
      setMode('recording');
    }
  };

  const startRecording = () => {
    if (!mediaStream) return;
    
    setRecordedChunks([]);
    setIsRecording(true);
    
    const mediaRecorder = new MediaRecorder(mediaStream, { mimeType: 'video/webm' });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      setRecordedVideo(videoURL);
      setMode('playback');
      setIsRecording(false);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(10); // Collect data in 10ms chunks
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const saveRecording = async () => {
    if (!recordedVideo || !user) return;
    
    toast({
      title: "Video Saved",
      description: "Your conversation with Agent Veritas has been saved.",
    });
    
    handleOpenChange(false);
  };

  const submitUserQuery = (query: string) => {
    if (!query.trim()) return;
    
    setAgentResponding(true);
    submitQuery(query);
    
    const checkForResponse = setInterval(() => {
      if (consensusResponse && !isLoading) {
        clearInterval(checkForResponse);
        speakResponse(consensusResponse);
        setAgentResponding(false);
      }
    }, 1000);
    
    setTimeout(() => clearInterval(checkForResponse), 30000);
    
    setTimeout(() => handleOpenChange(false), 1000);
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
                  onModeSelect={processUserInput}
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
                  onModeSelect={processUserInput}
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
                  onSubmitQuery={submitUserQuery}
                  onClose={() => setIsOpen(false)}
                  isLoading={isLoading}
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
                  onSubmitQuery={submitUserQuery}
                  isLoading={isLoading}
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
