
import React from 'react';
import { Check, User } from 'lucide-react';

interface UserAuthStatusProps {
  user: any;
}

const UserAuthStatus: React.FC<UserAuthStatusProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="mt-2 mb-4">
      <div className="text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-2 rounded-full inline-flex items-center shadow-sm">
        <Check className="h-4 w-4 mr-1" />
        <span className="flex items-center">
          Signed in as 
          <span className="font-medium mx-1">
            {user.email || 'User'}
          </span>
          {user.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="User avatar" 
              className="w-5 h-5 rounded-full ml-1 border border-green-300 dark:border-green-700"
            />
          ) : (
            <User className="h-3 w-3 ml-1" />
          )}
        </span>
      </div>
    </div>
  );
};

export default UserAuthStatus;
