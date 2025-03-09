
import React from 'react';
import { Check, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserAuthStatusProps {
  user: any;
}

const UserAuthStatus: React.FC<UserAuthStatusProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-2 mb-4"
    >
      <div className="text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3.5 py-2 rounded-full inline-flex items-center shadow-sm border border-green-100 dark:border-green-800/30">
        <Check className="h-3.5 w-3.5 mr-1" />
        <span className="flex items-center">
          <Shield className="h-3 w-3 mr-1.5" />
          <span className="mr-1">Verified as</span>
          <span className="font-medium mx-1">
            {user.email || 'User'}
          </span>
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="User avatar" 
              className="w-5 h-5 rounded-full ml-1 border border-green-200 dark:border-green-700"
            />
          ) : (
            <User className="h-3 w-3 ml-1" />
          )}
        </span>
      </div>
    </motion.div>
  );
};

export default UserAuthStatus;
