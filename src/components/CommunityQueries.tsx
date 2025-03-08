
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, Award, User, CheckSquare } from 'lucide-react';

// Sample data for community queries
const communityQueries = [
  {
    id: 1,
    question: "What causes northern lights?",
    answer: "The Northern Lights (Aurora Borealis) are caused by solar particles colliding with atmospheric gases. When charged particles from the sun strike atoms and molecules in Earth's atmosphere, they excite those particles, causing them to light up.",
    upvotes: 124,
    user: "AstroEnthusiast",
    verified: true,
    date: "2 days ago"
  },
  {
    id: 2,
    question: "How do neural networks work?",
    answer: "Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes or 'neurons' that process information. Each connection can transmit a signal to other neurons. Through training with labeled data, these networks learn to recognize patterns and make predictions.",
    upvotes: 87,
    user: "AIResearcher",
    verified: true,
    date: "1 week ago"
  },
  {
    id: 3,
    question: "Is coffee good for your health?",
    answer: "Coffee consumption has mixed health effects. Studies suggest moderate coffee intake (3-4 cups daily) may reduce risk of certain diseases like type 2 diabetes, Parkinson's, and some liver conditions. However, excessive consumption can cause anxiety, insomnia, and digestive issues. Individual responses vary based on genetics and overall health.",
    upvotes: 56,
    user: "HealthScientist",
    verified: false,
    date: "3 days ago"
  }
];

const CommunityQueries: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto mt-8 mb-16"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Community Questions</h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
          See all
        </button>
      </div>
      
      <div className="space-y-6">
        {communityQueries.map((query) => (
          <div key={query.id} className="rounded-xl glass card-shadow overflow-hidden">
            <div className="p-5">
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center mr-3">
                  <User className="text-white w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{query.user}</span>
                    {query.verified && (
                      <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                        <CheckSquare className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{query.date}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-2">{query.question}</h3>
              <p className="text-gray-700 mb-4">{query.answer}</p>
              
              <div className="flex items-center text-gray-500 text-sm">
                <button className="flex items-center hover:text-blue-600 transition-colors">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {query.upvotes}
                </button>
                <button className="flex items-center ml-4 hover:text-blue-600 transition-colors">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CommunityQueries;
