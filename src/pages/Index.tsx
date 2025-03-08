
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import QueryInterface from '../components/QueryInterface';
import ConsensusVisual from '../components/ConsensusVisual';
import CommunityQueries from '../components/CommunityQueries';
import { useQueryContext } from '../context/QueryContext';
import { Shield, CheckCircle } from 'lucide-react';

const Index = () => {
  const { responses, query } = useQueryContext();
  
  return (
    <div className="relative min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <Header />
      
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
          
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
              <Shield className="text-white w-6 h-6" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Truthful
            </h1>
          </div>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Truthful - Verifiable AI knowledge you can trust
          </p>
        </motion.div>
        
        <QueryInterface />
        
        {responses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <ConsensusVisual responses={responses} />
          </motion.div>
        )}

        <CommunityQueries />
      </div>
    </div>
  );
};

export default Index;
