
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ThumbsUp, User, CheckSquare, ChevronDown, ChevronUp, Activity, Brain, Heart } from 'lucide-react';

// Sample data for community queries
const communityQueriesByCategory = {
  health: [
    {
      id: 1,
      question: "What are the symptoms of late stage lymphoma?",
      answer: "Late-stage lymphoma symptoms may include persistent fatigue, unexplained weight loss, night sweats, enlarged lymph nodes in multiple areas, shortness of breath, and potential organ dysfunction depending on tumor location. B symptoms (fever, night sweats, weight loss) often indicate more advanced disease. Patients may experience reduced immunity and increased susceptibility to infections.",
      upvotes: 124,
      user: "OncologyMD",
      verified: true,
      date: "2 days ago"
    },
    {
      id: 2,
      question: "How to differentiate between viral and bacterial pneumonia?",
      answer: "Differentiating viral from bacterial pneumonia involves several clinical indicators: bacterial pneumonia typically presents with higher fever, productive cough with purulent sputum, and focal consolidation on imaging. Viral pneumonia often shows more diffuse interstitial patterns, lower-grade fever, and non-productive cough. Lab tests show elevated WBC counts in bacterial infections, while normal/low counts are common in viral cases. Procalcitonin levels may be more elevated in bacterial pneumonia.",
      upvotes: 87,
      user: "PulmonarySpecialist",
      verified: true,
      date: "1 week ago"
    },
    {
      id: 3,
      question: "What diagnostic criteria are used for rheumatoid arthritis?",
      answer: "Rheumatoid arthritis is diagnosed using the 2010 ACR/EULAR classification criteria, which include: joint involvement pattern (small vs. large joints), serology (rheumatoid factor and anti-CCP antibodies), acute-phase reactants (ESR and CRP levels), and symptom duration (>6 weeks). A score of ≥6/10 indicates definite RA. Additional diagnostic tools include radiographic changes, ultrasound for synovitis, and excluding other inflammatory arthritides.",
      upvotes: 56,
      user: "RheumatologyMD",
      verified: true,
      date: "3 days ago"
    }
  ],
  technology: [
    {
      id: 4,
      question: "How do neural networks work?",
      answer: "Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes or 'neurons' that process information. Each connection can transmit a signal to other neurons. Through training with labeled data, these networks learn to recognize patterns and make predictions.",
      upvotes: 92,
      user: "AIResearcher",
      verified: true,
      date: "1 week ago"
    }
  ],
  science: [
    {
      id: 5,
      question: "What causes northern lights?",
      answer: "The Northern Lights (Aurora Borealis) are caused by solar particles colliding with atmospheric gases. When charged particles from the sun strike atoms and molecules in Earth's atmosphere, they excite those particles, causing them to light up.",
      upvotes: 124,
      user: "AstroEnthusiast",
      verified: true,
      date: "2 days ago"
    }
  ]
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'health':
      return <Heart className="w-5 h-5 text-pink-500" />;
    case 'technology':
      return <Brain className="w-5 h-5 text-purple-500" />;
    case 'science':
      return <Activity className="w-5 h-5 text-blue-500" />;
    default:
      return <MessageCircle className="w-5 h-5 text-gray-500" />;
  }
};

const CategorySection = ({ category, queries }: { category: string; queries: any[] }) => {
  const [isExpanded, setIsExpanded] = useState(category === 'health'); // Health is expanded by default
  
  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all border border-gray-200"
      >
        <div className="flex items-center">
          {getCategoryIcon(category)}
          <h3 className="ml-2 text-lg font-medium capitalize">{category}</h3>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-4">
          {queries.map((query) => (
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
      )}
    </div>
  );
};

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
      
      <div className="space-y-4">
        {Object.entries(communityQueriesByCategory).map(([category, queries]) => (
          <CategorySection key={category} category={category} queries={queries} />
        ))}
      </div>
    </motion.div>
  );
};

export default CommunityQueries;
