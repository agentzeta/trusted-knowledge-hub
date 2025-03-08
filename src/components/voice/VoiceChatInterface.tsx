
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface VoiceChatInterfaceProps {
  agentScript: string[];
  onSubmitQuery: (query: string) => void;
  onClose: () => void;
  isLoading: boolean;
  agentResponding: boolean;
}

const VoiceChatInterface: React.FC<VoiceChatInterfaceProps> = ({
  agentScript,
  onSubmitQuery,
  onClose,
  isLoading,
  agentResponding
}) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onSubmitQuery(userInput);
    setUserInput('');
  };

  return (
    <div className="p-6">
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
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button type="submit" disabled={isLoading || agentResponding}>
              {isLoading || agentResponding ? 'Processing...' : 'Ask Question'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoiceChatInterface;
