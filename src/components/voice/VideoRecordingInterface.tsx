
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface VideoRecordingInterfaceProps {
  agentScript: string[];
  videoRef: React.RefObject<HTMLVideoElement>;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancel: () => void;
  onSubmitQuery: (query: string) => void;
  isLoading: boolean;
  agentResponding: boolean;
}

const VideoRecordingInterface: React.FC<VideoRecordingInterfaceProps> = ({
  agentScript,
  videoRef,
  isRecording,
  onStartRecording,
  onStopRecording,
  onCancel,
  onSubmitQuery,
  isLoading,
  agentResponding
}) => {
  const [userInput, setUserInput] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onSubmitQuery(userInput);
    setUserInput('');
  };

  return (
    <div className="p-6">
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
            onClick={onStartRecording}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Start Recording
          </Button>
        ) : (
          <Button 
            onClick={onStopRecording}
            variant="destructive"
          >
            Stop Recording
          </Button>
        )}
        
        <Button 
          onClick={onCancel}
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
    </div>
  );
};

export default VideoRecordingInterface;
