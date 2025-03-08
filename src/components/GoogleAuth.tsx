
import React from 'react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Google, FileText, Cloud, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const GoogleAuth: React.FC = () => {
  const handleGoogleSignIn = () => {
    toast({
      title: "Supabase Integration Required",
      description: "Please connect to Supabase to enable Google Authentication.",
      duration: 3000,
    });
  };

  const handleGoogleDocsExport = () => {
    toast({
      title: "Google Docs Export",
      description: "This feature will allow exporting your query results to Google Docs.",
      duration: 3000,
    });
  };

  return (
    <div className="fixed top-20 right-4 flex flex-col space-y-2 z-40">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleGoogleSignIn} 
              size="icon" 
              variant="outline" 
              className="bg-white hover:bg-gray-100"
            >
              <Google className="h-4 w-4 text-gray-800" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Sign in with Google</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleGoogleDocsExport} 
              size="icon" 
              variant="outline" 
              className="bg-white hover:bg-gray-100"
            >
              <FileText className="h-4 w-4 text-gray-800" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Export to Google Docs</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default GoogleAuth;
