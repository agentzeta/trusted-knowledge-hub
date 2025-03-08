
import { useState, useEffect } from 'react';
import { useQueryContext } from './useQueryContext';
import { useSpeechRecognition } from './voice/useSpeechRecognition';
import { useSpeechSynthesis } from './voice/useSpeechSynthesis';
import { useVoiceIntents } from './voice/useVoiceIntents';
import { toast } from '@/components/ui/use-toast';

export const useVoiceAgent = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceId, setVoiceId] = useState("FGY2WhTYpPnrIDTdsKH5"); // Default to Laura (calm female voice)
  
  const { consensusResponse } = useQueryContext();
  
  // Create speech synthesis hooks
  const {
    audioRef,
    speakResponse,
    stopSpeaking
  } = useSpeechSynthesis(setIsSpeaking, voiceId);
  
  // Create voice intents processor
  const { processVoiceInput } = useVoiceIntents(speakResponse);
  
  // Create speech recognition hooks
  const {
    recognitionRef,
    startListening,
    stopListening
  } = useSpeechRecognition(setIsListening, processVoiceInput);
  
  // Function to speak the consensus response
  const speakConsensus = () => {
    if (consensusResponse) {
      speakResponse(consensusResponse);
    } else {
      toast({
        title: "No Response",
        description: "Ask a question first to get a response that can be spoken",
        variant: "destructive",
      });
    }
  };
  
  // Function to change the voice
  const changeVoice = (newVoiceId: string) => {
    setVoiceId(newVoiceId);
  };
  
  return {
    isSpeaking,
    isListening,
    speakResponse,
    speakConsensus,
    stopSpeaking,
    startListening,
    stopListening,
    changeVoice,
    voiceId
  };
};
