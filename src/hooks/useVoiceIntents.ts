
import { useEffect } from 'react';
import { useQueryContext } from '@/hooks/useQueryContext';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';

export const useVoiceIntents = () => {
  const { submitQuery } = useQueryContext();
  const { startListening, stopListening, isSpeaking } = useVoiceAgent();

  useEffect(() => {
    const handleUserSpeech = (event: CustomEvent) => {
      const spokenText = event.detail.results[0][0].transcript;
      
      if (spokenText.toLowerCase().includes('search for') || 
          spokenText.toLowerCase().includes('tell me about')) {
        const query = spokenText.replace(/search for|tell me about/i, '').trim();
        if (query) {
          console.log('Voice command detected, submitting query:', query);
          submitQuery(query);
        }
      }
    };

    window.addEventListener('speech-recognition-result', handleUserSpeech as EventListener);
    
    return () => {
      window.removeEventListener('speech-recognition-result', handleUserSpeech as EventListener);
    };
  }, [submitQuery]);

  return {
    startListening,
    stopListening,
    isSpeaking
  };
};
