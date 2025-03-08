
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { FileText, LogIn, LogOut, User, Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQueryContext } from '@/hooks/useQueryContext';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const GoogleAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { query, consensusResponse, exportToGoogleDocs } = useQueryContext();
  const { user, signInWithGoogle, signOut } = useSupabaseAuth();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDocsExport = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in with Google to export to Google Docs",
        duration: 3000,
      });
      return;
    }

    if (!query || !consensusResponse) {
      toast({
        title: "No Content to Export",
        description: "Please run a query first to generate content for export",
        duration: 3000,
      });
      return;
    }

    try {
      await exportToGoogleDocs();
    } catch (error: any) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export to Google Docs",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className="fixed top-20 right-4 flex flex-col space-y-2 z-40">
      <TooltipProvider>
        {loading ? (
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
        ) : user ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleGoogleSignOut} 
                  size="icon" 
                  variant="outline" 
                  className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 border-blue-200 shadow-md"
                >
                  <LogOut className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-blue-50 border-blue-200">
                <p>Sign out</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleGoogleDocsExport} 
                  size="icon" 
                  variant="outline" 
                  className={`bg-white/80 backdrop-blur-sm hover:bg-gray-100 border-blue-200 shadow-md ${
                    !query || !consensusResponse ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={!query || !consensusResponse}
                >
                  <Upload className="h-4 w-4 text-blue-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-blue-50 border-blue-200">
                <p>Export to Google Docs</p>
              </TooltipContent>
            </Tooltip>
            
            <div className="flex items-center justify-center mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-md border-2 border-white">
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url} 
                    alt="User avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
            </div>
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleGoogleSignIn} 
                size="icon" 
                variant="outline" 
                className="bg-white/80 backdrop-blur-sm hover:bg-gray-100 border-blue-200 shadow-md"
              >
                <LogIn className="h-4 w-4 text-blue-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-blue-50 border-blue-200">
              <p>Sign in with Google</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default GoogleAuth;
