
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import { Shield, Database, Network, CheckCircle2 } from 'lucide-react';

const AboutSection = ({ 
  title, 
  description, 
  icon, 
  index 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    className="flex flex-col sm:flex-row p-6 rounded-xl glass card-shadow hover-card-shadow transition-all duration-300"
  >
    <div className="flex-shrink-0 flex items-start justify-center sm:justify-start mb-4 sm:mb-0 sm:mr-6">
      <div className="p-3 rounded-lg bg-blue-50">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </motion.div>
);

const About = () => {
  const sections = [
    {
      title: "Decentralized Verification",
      description: "Multiple AI models evaluate each query, providing diverse perspectives. Only information verified through consensus is considered trustworthy.",
      icon: <Shield className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Tamper-Proof Storage",
      description: "Verified knowledge is stored on decentralized networks, making it resistant to censorship and manipulation.",
      icon: <Database className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Flare Data Connector",
      description: "FDC provides a secure bridge between AI systems and decentralized consensus mechanisms, ensuring verification integrity.",
      icon: <Network className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Trustless Architecture",
      description: "You don't need to trust any single entity. The system's design ensures that only consensus-validated information is presented.",
      icon: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
    },
  ];

  return (
    <>
      <Header />
      <div className="relative min-h-screen pt-20 pb-16 px-4 sm:px-6">
        <div className="blur-background">
          <div className="blur-circle bg-blue-300 w-[500px] h-[500px] top-[-100px] right-[-200px]" />
          <div className="blur-circle bg-purple-300 w-[400px] h-[400px] bottom-[-100px] left-[-150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              About Verifiable Knowledge
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Creating a trusted layer for AI knowledge through decentralized consensus.
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {sections.map((section, index) => (
              <AboutSection
                key={index}
                index={index}
                title={section.title}
                description={section.description}
                icon={section.icon}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 p-6 rounded-xl glass text-center"
          >
            <h3 className="text-lg font-medium mb-3">Building the Future of Trusted AI</h3>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              This platform represents an early implementation of consensus-verified AI knowledge. 
              As we expand, we'll integrate with more AI models and blockchain networks to create 
              a robust ecosystem of verifiable information.
            </p>
            <a
              href="https://flare.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
            >
              Learn More About Flare Network
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default About;
