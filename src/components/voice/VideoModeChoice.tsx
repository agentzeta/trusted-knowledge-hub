
import React, { useState, useRef } from 'react';
import { Mic, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoModeChoiceProps {
  agentScript: string[];
  onModeSelect: (input: string) => void;
}

const VideoModeChoice: React.FC<VideoModeChoiceProps> = ({
  agentScript,
  onModeSelect
}) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onModeSelect(userInput);
    setUserInput('');
  };

  return (
    <div className="p-6 text-center">
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
          onClick={() => onModeSelect('just voice')}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Mic className="h-4 w-4" />
          Just Voice
        </Button>
        <Button 
          onClick={() => onModeSelect('with video')}
          className="flex items-center gap-2"
        >
          <Video className="h-4 w-4" />
          With Video
        </Button>
      </div>
    </div>
  );
};

export default VideoModeChoice;
