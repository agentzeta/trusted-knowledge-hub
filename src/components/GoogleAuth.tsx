
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { FileText, LogIn, LogOut, User } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const GoogleAuth: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);

      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
        }
      );

      // Cleanup listener on unmount
      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkSession();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/documents',
          redirectTo: window.location.origin,
        }
      });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleGoogleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        toast({
          title: "Signed out successfully",
          duration: 2000,
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign Out Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
        duration: 3000,
      });
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

    toast({
      title: "Google Docs Export",
      description: "Preparing to export your query results to Google Docs...",
      duration: 3000,
    });
    
    // We'll implement the export functionality in a future step
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
                  className="bg-white hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 text-gray-800" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Sign out</p>
              </TooltipContent>
            </Tooltip>

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
          </>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleGoogleSignIn} 
                size="icon" 
                variant="outline" 
                className="bg-white hover:bg-gray-100"
              >
                <LogIn className="h-4 w-4 text-gray-800" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Sign in with Google</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

export default GoogleAuth;
