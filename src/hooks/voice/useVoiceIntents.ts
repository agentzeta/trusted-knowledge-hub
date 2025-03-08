import { useQueryContext } from '../useQueryContext';

export const useVoiceIntents = (speakResponse: (text: string) => Promise<void>) => {
  const { submitQuery } = useQueryContext();

  const processVoiceInput = (transcript: string) => {
    console.log('Processing voice input:', transcript);
    const normalizedText = transcript.toLowerCase().trim();
    
    // Check for speaking to agent intent
    if (normalizedText.includes('speak') || normalizedText.includes('agent') || 
        normalizedText.includes('voice') || normalizedText.includes('talk')) {
      console.log('User wants to speak to agent');
      speakResponse("Great! Would you like me to use video or just voice for our conversation?");
    } 
    // Check for text intent
    else if (normalizedText.includes('text') || normalizedText.includes('type') || 
             normalizedText.includes('chat')) {
      console.log('User wants to use text');
      speakResponse("Switching to text mode. Please type your question in the search box.");
    }
    // Check for video intent  
    else if (normalizedText.includes('video')) {
      console.log('User wants video mode');
      speakResponse("Starting video mode. Please allow camera access if prompted.");
      // Additional logic to trigger video mode would go here
    }
    // Otherwise treat as a question
    else {
      console.log('Processing as a question:', normalizedText);
      submitQuery(normalizedText);
      speakResponse("I'll find an answer to that question for you.");
    }
  };

  return {
    processVoiceInput
  };
};
