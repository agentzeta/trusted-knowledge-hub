
import { useState, useEffect } from 'react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useQueryContext } from '@/hooks/useQueryContext';

export type AgentMode = 'initial' | 'voice' | 'video' | 'recording' | 'playback';

export const useAgentInteraction = (initialMode: 'voice' | 'video' = 'voice') => {
  const [mode, setMode] = useState<AgentMode>('initial');
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [agentResponding, setAgentResponding] = useState(false);
  
  const { 
    speakResponse, 
    isSpeaking, 
    stopSpeaking, 
    startListening, 
    stopListening, 
    isListening 
  } = useVoiceAgent();
  
  const { consensusResponse, submitQuery, isLoading } = useQueryContext();

  const agentScript = [
    "Hello! Would you rather speak to our Agent or use text in the chat?",
    "Would you like to speak to Agent Vera through video, so the agent can see you and your background, or just voice is enough?",
    "Welcome to Truthful, I'm Agent Vera. I'm here to help provide verified information from multiple AI models. What field do you have questions about today?"
  ];

  useEffect(() => {
    if (initialMode === 'video') {
      setMode('video');
      setCurrentStep(1);
    } else if (initialMode === 'voice') {
      setMode('voice');
      setCurrentStep(1);
    }
  }, [initialMode]);

  const processUserInput = (input: string) => {
    const normalizedInput = input.trim().toLowerCase();
    console.log('Agent: Processing user input:', normalizedInput);
    
    if (currentStep === 0) {
      if (normalizedInput.includes('speak') || 
          normalizedInput.includes('agent') || 
          normalizedInput.includes('voice') || 
          normalizedInput.includes('talk')) {
        console.log('Agent: User chose to speak to agent');
        setCurrentStep(1);
        setMode('voice');
      } else if (normalizedInput.includes('text') || 
                normalizedInput.includes('chat') || 
                normalizedInput.includes('type')) {
        console.log('Agent: User chose text chat');
        submitUserQuery(input);
        return 'close';
      } else {
        setAgentResponding(true);
        speakResponse("I'm not sure if you want to speak to an agent or use text chat. Please clarify by saying 'speak to agent' or 'use text chat'.");
        setAgentResponding(false);
      }
    } 
    else if (currentStep === 1) {
      if (normalizedInput.includes('video')) {
        console.log('Agent: User chose video mode');
        setMode('video');
        setCurrentStep(2);
        return 'video';
      } else if (normalizedInput.includes('voice') || 
                normalizedInput.includes('audio') || 
                normalizedInput.includes('just voice') || 
                normalizedInput.includes('enough')) {
        console.log('Agent: User chose voice mode');
        handleVoiceMode();
      } else {
        setAgentResponding(true);
        speakResponse("I'm not sure if you want video or just voice. Please clarify by saying 'use video' or 'just voice'.");
        setAgentResponding(false);
      }
    }
    else if (currentStep === 2) {
      console.log('Agent: Processing query:', normalizedInput);
      submitUserQuery(input);
    }
    
    return null;
  };

  const handleVoiceMode = () => {
    setMode('voice');
    setCurrentStep(2); // Skip to introduction
    speakResponse(agentScript[2]);
  };

  const submitUserQuery = (query: string) => {
    if (!query.trim()) return;
    
    setAgentResponding(true);
    console.log('Agent: Submitting user query to get multiple LLM responses:', query);
    submitQuery(query);
    
    const checkForResponse = setInterval(() => {
      if (consensusResponse && !isLoading) {
        clearInterval(checkForResponse);
        speakResponse(consensusResponse);
        setAgentResponding(false);
      }
    }, 1000);
    
    setTimeout(() => clearInterval(checkForResponse), 30000);
    
    return 'close';
  };

  return {
    mode,
    setMode,
    currentStep,
    setCurrentStep,
    userInput,
    setUserInput,
    agentResponding,
    setAgentResponding,
    isSpeaking,
    isListening,
    startListening,
    stopListening,
    speakResponse,
    isLoading,
    agentScript,
    processUserInput,
    handleVoiceMode,
    submitUserQuery
  };
};
