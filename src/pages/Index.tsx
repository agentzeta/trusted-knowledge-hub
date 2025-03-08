
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import QueryInterface from '../components/QueryInterface';
import ConsensusVisual from '../components/ConsensusVisual';
import { QueryProvider, useQueryContext } from '../context/QueryContext';

const MainContent = () => {
  const { responses, query } = useQueryContext();
  
  return (
    <div className="relative min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="blur-background">
        <div className="blur-circle bg-blue-300 w-[500px] h-[500px] top-[-100px] left-[-200px]" />
        <div className="blur-circle bg-purple-300 w-[400px] h-[400px] bottom-[-100px] right-[-150px]" />
      </div>
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-4"
          >
            Powered by Flare Data Connector
          </motion.div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Verifiable AI Knowledge
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Consensus-verified AI responses you can trust, secured by decentralized validation.
          </p>
        </motion.div>
        
        <QueryInterface />
        
        {responses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ConsensusVisual responses={responses} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <QueryProvider>
      <Header />
      <MainContent />
    </QueryProvider>
  );
};

export default Index;
