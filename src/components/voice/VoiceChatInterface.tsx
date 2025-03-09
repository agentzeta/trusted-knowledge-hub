
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, X, Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import AgentVeritasAvatar from '../AgentVeritasAvatar';

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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-center mb-6">
        <AgentVeritasAvatar size="lg" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <p className="text-lg font-light text-slate-700 dark:text-slate-300">{agentScript[2]}</p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <form onSubmit={handleFormSubmit} className="w-full max-w-md">
          <div className="w-full relative mb-4">
            <input 
              ref={inputRef}
              type="text" 
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your question here..."
              className="w-full px-4 py-3 pr-12 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white backdrop-blur-sm"
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!userInput.trim() || isLoading || agentResponding}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-500 disabled:text-slate-300 dark:disabled:text-slate-600 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={onClose} 
              variant="outline"
              className="flex items-center gap-2 border-slate-200 dark:border-slate-700"
            >
              <X className="h-4 w-4" />
              Close
            </Button>
            
            <Button 
              type="submit" 
              disabled={!userInput.trim() || isLoading || agentResponding}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            >
              {isLoading || agentResponding ? (
                <span className="flex items-center gap-2">
                  <span className="animate-pulse w-2 h-2 bg-white rounded-full" />
                  <span className="animate-pulse w-2 h-2 bg-white rounded-full" delay-100 />
                  <span className="animate-pulse w-2 h-2 bg-white rounded-full" delay-200 />
                  Processing
                </span>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Ask Question
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VoiceChatInterface;
