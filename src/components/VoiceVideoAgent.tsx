
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Mic, 
  VideoOff, 
  MicOff, 
  Play, 
  Square, 
  Save,
  X,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useQueryContext } from '@/hooks/useQueryContext';
import { toast } from '@/components/ui/use-toast';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import AgentVeritasAvatar from './AgentVeritasAvatar';

interface VoiceVideoAgentProps {
  initialMode?: 'voice' | 'video';
}

export const VoiceVideoAgent: React.FC<VoiceVideoAgentProps> = ({ initialMode = 'voice' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'initial' | 'voice' | 'video' | 'recording' | 'playback'>('initial');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [userInput, setUserInput] = useState('');
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [agentResponding, setAgentResponding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { speakResponse, isSpeaking, stopSpeaking } = useVoiceAgent();
  const { consensusResponse, submitQuery, isLoading } = useQueryContext();
  const { user } = useSupabaseAuth();
  
  // Agent script steps
  const [currentStep, setCurrentStep] = useState(0);
  const agentScript = [
    "Hello! Would you rather speak to our Agent or use text in the chat?",
    "Would you like to speak to Agent Veritas through video, so the agent can see you and your background, or just voice is enough?",
    "Welcome to Truthful, I'm Agent Veritas. I'm here to help provide verified information from multiple AI models. What field do you have questions about today?"
  ];

  // Reset when dialog closes
  useEffect(() => {
    if (!isOpen) {
      cleanupMedia();
      setMode('initial');
      setCurrentStep(0);
      setRecordedChunks([]);
      setRecordedVideo(null);
      setUserInput('');
      setAgentResponding(false);
    } else {
      // If initialMode is set, immediately transition to that mode
      if (initialMode === 'video') {
        setMode('video');
        setCurrentStep(1);
        handleVideoMode();
      } else if (initialMode === 'voice') {
        setMode('voice');
        setCurrentStep(1);
      }
    }
  }, [isOpen, initialMode]);

  // Speak the current agent script
  useEffect(() => {
    if (isOpen && !isSpeaking && !agentResponding && agentScript[currentStep]) {
      speakResponse(agentScript[currentStep]);
    }
  }, [currentStep, isOpen, isSpeaking, agentResponding]);

  // Setup media stream for video
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

  // Clean up media resources
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

  // Process user input and determine next step
  const processUserInput = (input: string) => {
    const normalizedInput = input.trim().toLowerCase();
    
    // If in initial mode, determine whether to go to voice or text
    if (currentStep === 0) {
      if (normalizedInput.includes('speak') || 
          normalizedInput.includes('agent') || 
          normalizedInput.includes('voice') || 
          normalizedInput.includes('talk')) {
        setCurrentStep(1);
        setMode('voice');
      } else if (normalizedInput.includes('text') || 
                normalizedInput.includes('chat') || 
                normalizedInput.includes('type')) {
        submitUserQuery(input);
        setIsOpen(false);
      } else {
        // If unclear, ask again
        setAgentResponding(true);
        speakResponse("I'm not sure if you want to speak to an agent or use text chat. Please clarify.");
        setAgentResponding(false);
      }
    } 
    // If choosing between voice and video
    else if (currentStep === 1) {
      if (normalizedInput.includes('video')) {
        handleVideoMode();
      } else if (normalizedInput.includes('voice') || 
                normalizedInput.includes('audio') || 
                normalizedInput.includes('just voice') || 
                normalizedInput.includes('enough')) {
        handleVoiceMode();
      } else {
        // If unclear, ask again
        setAgentResponding(true);
        speakResponse("I'm not sure if you want video or just voice. Please clarify if you want video or just voice.");
        setAgentResponding(false);
      }
    }
    // If in conversation mode, submit query
    else if (currentStep === 2) {
      submitUserQuery(input);
    }
  };

  // Handle choosing voice mode
  const handleVoiceMode = () => {
    setMode('voice');
    setCurrentStep(2); // Skip to introduction
    speakResponse(agentScript[2]);
  };

  // Handle choosing video mode
  const handleVideoMode = async () => {
    setMode('video');
    setCurrentStep(2);
    const stream = await setupVideoStream();
    if (stream) {
      setMode('recording');
    }
  };

  // Start recording video
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

  // Stop recording video
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Save recorded video
  const saveRecording = async () => {
    if (!recordedVideo || !user) return;
    
    toast({
      title: "Video Saved",
      description: "Your conversation with Agent Veritas has been saved.",
    });
    
    // Here we would typically upload to storage
    // For now, just close the dialog
    setIsOpen(false);
  };

  // Submit user query and have agent respond
  const submitUserQuery = (query: string) => {
    if (!query.trim()) return;
    
    setAgentResponding(true);
    submitQuery(query);
    
    // After submitting, prepare to speak the response when it's ready
    const checkForResponse = setInterval(() => {
      if (consensusResponse && !isLoading) {
        clearInterval(checkForResponse);
        speakResponse(consensusResponse);
        setAgentResponding(false);
      }
    }, 1000);
    
    // Clear interval after 30 seconds to prevent memory leaks
    setTimeout(() => clearInterval(checkForResponse), 30000);
    
    // Close the dialog after submission
    setTimeout(() => setIsOpen(false), 1000);
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processUserInput(userInput);
    setUserInput('');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
            size="icon"
          >
            {initialMode === 'video' ? <Video className="h-5 w-5" /> : <AgentVeritasAvatar size="sm" />}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <AgentVeritasAvatar size="sm" />
              <span>
                {mode === 'initial' && "Agent Veritas"}
                {mode === 'voice' && "Voice Chat with Agent Veritas"}
                {(mode === 'video' || mode === 'recording') && "Video Chat with Agent Veritas"}
                {mode === 'playback' && "Review Your Recording"}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          <AnimatePresence mode="wait">
            {mode === 'initial' && (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center"
              >
                <p className="mb-6">{agentScript[0]}</p>
                <form onSubmit={handleFormSubmit} className="mb-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </form>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => processUserInput('speak to agent')}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Mic className="h-4 w-4" />
                    Voice Chat
                  </Button>
                  <Button 
                    onClick={() => processUserInput('use text')}
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Text Chat
                  </Button>
                </div>
              </motion.div>
            )}
            
            {mode === 'voice' && currentStep === 1 && (
              <motion.div 
                key="video-choice"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 text-center"
              >
                <p className="mb-6">{agentScript[1]}</p>
                <form onSubmit={handleFormSubmit} className="mb-4">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your response..."
                    className="w-full px-4 py-2 mb-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                </form>
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => processUserInput('just voice')}
                    className="flex items-center gap-2"
                    variant="outline"
                  >
                    <Mic className="h-4 w-4" />
                    Just Voice
                  </Button>
                  <Button 
                    onClick={() => processUserInput('with video')}
                    className="flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    With Video
                  </Button>
                </div>
              </motion.div>
            )}
            
            {mode === 'voice' && currentStep === 2 && (
              <motion.div 
                key="voice-chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <p>{agentScript[2]}</p>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                  <form onSubmit={handleFormSubmit} className="w-full">
                    <div className="w-full max-w-md mb-2">
                      <input 
                        ref={inputRef}
                        type="text" 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your question here..."
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button onClick={() => setIsOpen(false)} variant="outline">
                        Close
                      </Button>
                      <Button type="submit" disabled={isLoading || agentResponding}>
                        {isLoading || agentResponding ? 'Processing...' : 'Ask Question'}
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
            
            {(mode === 'recording' || mode === 'video') && (
              <motion.div 
                key="video-recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
                  <video 
                    ref={videoRef} 
                    className="w-full h-64 object-cover" 
                    autoPlay 
                    muted 
                    playsInline
                  />
                  {isRecording && (
                    <div className="absolute top-2 right-2 flex items-center bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      <span className="animate-pulse mr-1">●</span> Recording
                    </div>
                  )}
                </div>
                
                <div className="text-center mb-4">
                  <p>{agentScript[2]}</p>
                </div>
                
                <div className="flex justify-center gap-4">
                  {!isRecording ? (
                    <Button 
                      onClick={startRecording}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Start Recording
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopRecording}
                      variant="destructive"
                    >
                      Stop Recording
                    </Button>
                  )}
                  
                  <Button 
                    onClick={() => {
                      cleanupMedia();
                      setIsOpen(false);
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="mt-4">
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your question here..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex justify-center mt-2">
                    <Button type="submit" disabled={isLoading || agentResponding}>
                      {isLoading || agentResponding ? 'Processing...' : 'Ask Question'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
            
            {mode === 'playback' && (
              <motion.div 
                key="video-playback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
                  <video 
                    src={recordedVideo || undefined} 
                    className="w-full h-64 object-cover" 
                    controls
                  />
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    onClick={() => {
                      // Restart recording process
                      setRecordedVideo(null);
                      setRecordedChunks([]);
                      setMode('recording');
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" /> Discard
                  </Button>
                  
                  <Button 
                    onClick={saveRecording}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Save className="h-4 w-4" /> Save Recording
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Default export maintains backwards compatibility
const VoiceVideoAgentDefault: React.FC = () => {
  return <VoiceVideoAgent initialMode="voice" />;
};

export default VoiceVideoAgentDefault;
