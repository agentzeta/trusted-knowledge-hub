
import React, { useState, useRef } from 'react';
import { Mic, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InitialModeSelectionProps {
  agentScript: string[];
  isListening: boolean;
  onModeSelect: (input: string) => void;
}

const InitialModeSelection: React.FC<InitialModeSelectionProps> = ({
  agentScript,
  isListening,
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
          onClick={() => onModeSelect('speak to agent')}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Mic className="h-4 w-4" />
          Voice Chat
        </Button>
        <Button 
          onClick={() => onModeSelect('use text')}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Text Chat
        </Button>
      </div>
      {!isListening && (
        <p className="mt-4 text-sm text-gray-500">
          You can also speak your response. Click the microphone button or say "speak to agent" or "use text chat".
        </p>
      )}
      {isListening && (
        <p className="mt-4 text-sm text-green-500 animate-pulse">
          I'm listening... Say "speak to agent" or "use text chat".
        </p>
      )}
    </div>
  );
};

export default InitialModeSelection;
