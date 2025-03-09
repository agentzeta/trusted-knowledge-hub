import { useQueryContext } from '@/hooks/useQueryContext';
import { useState } from 'react';

export const useVoiceIntents = (speakResponse: (text: string) => Promise<void>) => {
  const { submitQuery } = useQueryContext();
  const [lastTranscript, setLastTranscript] = useState('');

  const processVoiceInput = (transcript: string) => {
    // Store the transcript
    setLastTranscript(transcript);
    
    // Check for help commands
    if (transcript.toLowerCase().includes('help') || 
        transcript.toLowerCase().includes('what can you do')) {
      speakResponse('I can answer questions about various topics by consulting multiple AI models. Try asking me a factual question, and I\'ll give you a consensus answer.');
      return;
    }
    
    // Check for repeat commands
    if (transcript.toLowerCase().includes('repeat that') || 
        transcript.toLowerCase().includes('say that again')) {
      speakResponse('Let me repeat the last response.');
      return;
    }
    
    // Otherwise, treat input as a query
    submitQuery(transcript);
  };

  return {
    processVoiceInput,
    lastTranscript
  };
};
