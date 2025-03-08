
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryContext } from '../context/QueryContext';
import { Search, LogIn } from 'lucide-react';
import ApiKeyManager from './ApiKeyManager';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import SearchSuggestions from './SearchSuggestions';
import useClickOutside from '../hooks/useClickOutside';

// Example queries by category
const exampleQueries = {
  science: "What causes northern lights?",
  history: "Who built the Great Wall of China?",
  politics: "How does the Electoral College work?",
  health: "Is coffee good for your health?",
  technology: "How do neural networks work?"
};

// Sample stored queries for search suggestions
const storedQueries = [
  { id: 1, query: "How does climate change affect coral reefs?" },
  { id: 2, query: "What is quantum computing?" },
  { id: 3, query: "How do vaccines work?" },
  { id: 4, query: "Who was Nikola Tesla?" },
  { id: 5, query: "What caused the 2008 financial crisis?" },
  { id: 6, query: "How are black holes formed?" },
  { id: 7, query: "What is the theory of relativity?" },
  { id: 8, query: "How does machine learning work?" },
  { id: 9, query: "What are the effects of meditation on the brain?" },
  { id: 10, query: "How do electric cars work?" }
];

const QueryInterface: React.FC = () => {
  const { submitQuery, isLoading, query, responses, consensusResponse, user } = useQueryContext();
  const [inputQuery, setInputQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof storedQueries>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchContainerRef, () => {
    setShowSuggestions(false);
  });

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

  const handleExampleClick = (query: string) => {
    setInputQuery(query);
    submitQuery(query);
  };

  const handleSuggestionClick = (query: string) => {
    setInputQuery(query);
    submitQuery(query);
    setShowSuggestions(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
          redirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleInputFocus = () => {
    if (inputQuery.trim().length > 2) {
      setShowSuggestions(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Ask a question</h2>
        <div className="flex items-center gap-2">
          {!user && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGoogleSignIn}
              className="flex items-center gap-1"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign in</span>
            </Button>
          )}
          <ApiKeyManager />
        </div>
      </div>
      
      <div className="relative card-shadow hover-card-shadow rounded-2xl glass p-1 transition-all duration-300" ref={searchContainerRef}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Ask any question to get AI consensus..."
            className="block w-full bg-transparent border-0 py-4 pl-12 pr-24 text-sm sm:text-base focus:ring-0 focus:outline-none placeholder:text-gray-400"
            disabled={isLoading}
          />
          
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl ${
                isLoading || !inputQuery.trim()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors duration-300`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin" />
                  <span>Getting Answers</span>
                </div>
              ) : (
                'Get Answer'
              )}
            </motion.button>
          </div>
        </form>
        
        <SearchSuggestions 
          suggestions={suggestions} 
          onSuggestionClick={handleSuggestionClick} 
          isVisible={showSuggestions}
        />
      </div>
      
      <div className="mt-4 mb-6">
        <p className="text-sm text-gray-500 mb-2">Try an example query:</p>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          {Object.entries(exampleQueries).map(([category, queryText]) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExampleClick(queryText)}
              className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full border border-white/20 text-gray-700 dark:text-gray-200 transition-all"
              disabled={isLoading}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
      </div>
      
      {user && (
        <div className="mt-2 mb-4">
          <div className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full inline-flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
            Signed in as {user.email || 'User'}
          </div>
        </div>
      )}
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-center text-sm text-gray-500"
          >
            <div className="flex flex-col items-center space-y-2">
              <p>Consulting multiple AI models...</p>
              <div className="flex space-x-2 mt-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '600ms' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {consensusResponse && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-xl glass card-shadow"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">AI Response:</h2>
              <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                Multi-Model Consensus
              </span>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 dark:text-gray-300 text-lg whitespace-pre-line">{consensusResponse}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {responses.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 rounded-xl glass card-shadow"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Individual AI Responses:</h3>
            <div className="space-y-4">
              {responses.map((response) => (
                <div key={response.id} className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{response.source}</span>
                    <span className={response.verified ? "text-xs px-2 py-1 rounded-full bg-green-50 text-green-600" : "text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600"}>
                      {response.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{response.content}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QueryInterface;
