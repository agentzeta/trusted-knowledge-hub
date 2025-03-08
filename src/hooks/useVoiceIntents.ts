import { useQueryContext } from '../useQueryContext';
import { toast } from '@/components/ui/use-toast';

export const useVoiceIntents = (speakResponse: (text: string) => Promise<void>) => {
  const { submitQuery } = useQueryContext();

  const processVoiceInput = async (transcript: string) => {
    console.log('Processing voice input:', transcript);
    
    if (!transcript || transcript.trim().length === 0) {
      console.log('Empty transcript, ignoring');
      return;
    }
    
    const normalizedText = transcript.toLowerCase().trim();
    
    try {
      // Check for speaking to agent intent
      if (normalizedText.includes('speak') || normalizedText.includes('agent') || 
          normalizedText.includes('voice') || normalizedText.includes('talk')) {
        console.log('User wants to speak to agent');
        await speakResponse("Great! Would you like me to use video or just voice for our conversation?");
      } 
      // Check for text intent
      else if (normalizedText.includes('text') || normalizedText.includes('type') || 
               normalizedText.includes('chat')) {
        console.log('User wants to use text');
        await speakResponse("Switching to text mode. Please type your question in the search box.");
      }
      // Check for video intent  
      else if (normalizedText.includes('video')) {
        console.log('User wants video mode');
        await speakResponse("Would you prefer to record a video with me, so that I can see you and your background?");
        // Additional logic to trigger video mode would go here
      }
      // Check for ending conversation
      else if (normalizedText.includes('goodbye') || normalizedText.includes('bye') || 
               normalizedText.includes('end') || normalizedText.includes('stop') ||
               normalizedText.includes('terminate') || normalizedText.includes('close')) {
        console.log('User wants to end the conversation');
        await speakResponse("Thank you for chatting with Agent Veritas. Feel free to ask more questions anytime!");
      }
      // Otherwise treat as a question
      else {
        console.log('Processing as a question:', normalizedText);
        submitQuery(normalizedText);
        await speakResponse("I'll find an answer to that question for you from multiple AI models.");
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Voice Processing Error",
        description: "There was an error processing your voice request. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    processVoiceInput
  };
};
