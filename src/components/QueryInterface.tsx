import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQueryContext } from '../hooks/useQueryContext';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import QueryHeader from './QueryHeader';
import QuerySearchInput from './QuerySearchInput';
import UserAuthStatus from './UserAuthStatus';
import QueryResponses from './QueryResponses';
import WelcomeGreeting from './WelcomeGreeting';
import ExampleQueriesSection from './ExampleQueriesSection';
import StockPricePredictor from './finance/StockPricePredictor';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

const storedQueries = [
  { id: 1, query: "How does climate change affect coral reefs?" },
  { id: 2, query: "What is quantum computing?" },
  { id: 3, query: "How do vaccines work?" },
  { id: 4, query: "Who was Nikola Tesla?" },
  { id: 5, query: "What caused the 2008 financial crisis?" },
  { id: 6, query: "How are black holes formed?" },
  { id: 7, query: "What is the theory of relativity?" },
  { id: 8, query: "What are the events that are inflection points in evolution of AI industry?" },
  { id: 9, query: "What escape velocity can a space shuttle not exceed when orbiting earth, on its trajectory to Mars?" },
  { id: 10, query: "How have advancements in genomics changed medicine in the past decade?" }
];

const QueryInterface: React.FC = () => {
  const { submitQuery, isLoading, query, responses, consensusResponse } = useQueryContext();
  const { user, signInWithGoogle } = useSupabaseAuth();
  const [inputQuery, setInputQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof storedQueries>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [showStockPredictor, setShowStockPredictor] = useState(false);

  useEffect(() => {
    if (inputQuery.trim() && inputQuery.length > 2) {
      const filteredSuggestions = storedQueries.filter(q => 
        q.query.toLowerCase().includes(inputQuery.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      submitQuery(inputQuery.trim());
    }
  };

  const handleSuggestionClick = (query: string) => {
    setInputQuery(query);
    submitQuery(query);
    setShowSuggestions(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      // Error is already handled in the hook
    }
  };

  const handleChooseTextChat = () => {
    setShowChatOptions(false);
    // Focus the search input
    const searchInput = document.getElementById('query-search-input');
    if (searchInput) {
      searchInput.focus();
    }
  };

  const handleChooseVoiceChat = () => {
    setShowChatOptions(false);
    // Open the voice chat dialog
    const voiceButton = document.getElementById('voice-agent-button');
    if (voiceButton) {
      voiceButton.click();
    }
  };

  const handleChooseVideoChat = () => {
    setShowChatOptions(false);
    // Open the video chat dialog
    const videoButton = document.getElementById('video-agent-button');
    if (videoButton) {
      videoButton.click();
    }
  };

  const toggleStockPredictor = () => {
    setShowStockPredictor(!showStockPredictor);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      {showChatOptions && (
        <WelcomeGreeting 
          onChooseTextChat={handleChooseTextChat}
          onChooseVoiceChat={handleChooseVoiceChat}
          onChooseVideoChat={handleChooseVideoChat}
        />
      )}
      
      <QueryHeader
        handleGoogleSignIn={handleGoogleSignIn}
        user={user}
      />
      
      <QuerySearchInput
        inputQuery={inputQuery}
        setInputQuery={setInputQuery}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        handleSuggestionClick={handleSuggestionClick}
      />
      
      <UserAuthStatus user={user} />
      
      <div className="mt-4 flex items-center justify-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowExamples(!showExamples)}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {showExamples ? 'Hide Example Queries' : 'Show Example Queries by Category'}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleStockPredictor}
          className="text-sm flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {showStockPredictor ? 'Hide Stock Predictor' : 'FTSO Stock Predictor'}
        </Button>
      </div>
      
      {showExamples && (
        <ExampleQueriesSection 
          onExampleClick={handleSuggestionClick}
          isLoading={isLoading}
        />
      )}
      
      {showStockPredictor && (
        <div className="mt-6">
          <StockPricePredictor onClose={() => setShowStockPredictor(false)} />
        </div>
      )}
      
      <QueryResponses
        isLoading={isLoading}
        consensusResponse={consensusResponse}
        responses={responses}
      />
    </motion.div>
  );
};

export default QueryInterface;
