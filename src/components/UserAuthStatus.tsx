
import React from 'react';

interface UserAuthStatusProps {
  user: any;
}

const UserAuthStatus: React.FC<UserAuthStatusProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="mt-2 mb-4">
      <div className="text-sm bg-green-50 text-green-600 px-3 py-1 rounded-full inline-flex items-center">
        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
        Signed in as {user.email || 'User'}
      </div>
    </div>
  );
};

export default UserAuthStatus;
