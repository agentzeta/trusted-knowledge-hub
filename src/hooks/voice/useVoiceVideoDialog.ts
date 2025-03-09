
import { useState, useEffect } from 'react';
import { useAgentInteraction } from './useAgentInteraction';
import { useMediaRecording } from './useMediaRecording';

export const useVoiceVideoDialog = (
  initialMode: 'voice' | 'video' = 'voice',
  propIsOpen?: boolean,
  onOpenChange?: (open: boolean) => void
) => {
  const [isOpen, setIsOpen] = useState(propIsOpen || false);
  
  const { 
    mode, 
    setMode,
    currentStep,
    setCurrentStep,
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
      // Cleanup when dialog closes
      cleanupMedia();
      setMode('initial');
      setCurrentStep(0);
      setRecordedChunks([]);
      setRecordedVideo(null);
      if (isListening) {
        stopListening();
      }
    } else {
      // Start listening when dialog opens (after a slight delay)
      if (!isListening && !isSpeaking) {
        setTimeout(() => {
          console.log('Starting listening in useVoiceVideoDialog');
          startListening();
        }, 1000);
      }
      
      // If initial mode is video, setup video mode
      if (initialMode === 'video') {
        handleVideoMode();
      }
    }
  }, [isOpen, initialMode, isListening, isSpeaking]);

  const handleVideoMode = async () => {
    console.log('Handling video mode in useVoiceVideoDialog');
    setMode('video');
    setCurrentStep(2);
    const stream = await setupVideoStream();
    if (stream) {
      setMode('recording');
    }
  };

  const saveRecording = async () => {
    console.log('Saving recording in useVoiceVideoDialog');
    if (!recordedVideo) return;
    
    // Implementation for saving recording would go here
    
    return true;
  };

  return {
    isOpen,
    handleOpenChange,
    mode,
    currentStep,
    isListening,
    isSpeaking,
    agentScript,
    isRecording,
    recordedVideo,
    videoRef,
    processUserInput,
    handleVideoMode,
    startRecording,
    stopRecording,
    saveRecording,
    submitUserQuery
  };
};
