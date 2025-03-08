
import React from 'react';
import { LogIn, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ApiKeyManager from './ApiKeyManager';

interface QueryHeaderProps {
  handleGoogleSignIn: () => Promise<void>;
  user: any;
}

const QueryHeader: React.FC<QueryHeaderProps> = ({ handleGoogleSignIn, user }) => {
  return (
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
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          asChild
        >
          <ApiKeyManager />
        </Button>
      </div>
    </div>
  );
};

export default QueryHeader;
