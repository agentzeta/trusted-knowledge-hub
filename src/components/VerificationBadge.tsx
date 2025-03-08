
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock } from 'lucide-react';

interface VerificationBadgeProps {
  verified: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ verified }) => {
  return verified ? (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex items-center px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium"
    >
      <Check className="w-3 h-3 mr-1" />
      <span>Verified</span>
    </motion.div>
  ) : (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className="flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium"
    >
      <Clock className="w-3 h-3 mr-1" />
      <span>Pending</span>
    </motion.div>
  );
};

export default VerificationBadge;
