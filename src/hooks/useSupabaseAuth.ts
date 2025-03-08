
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user || null);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkSession();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      setAuthLoading(true);
      
      // First check if Google provider is enabled
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          scopes: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/documents',
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        if (error.message.includes('provider is not enabled')) {
          toast({
            title: "Authentication Error",
            description: "Google authentication is not enabled in Supabase. Please check your Supabase configuration.",
            variant: "destructive",
            duration: 5000,
          });
        } else {
          toast({
            title: "Authentication Error",
            description: error.message || "Failed to sign in with Google",
            variant: "destructive",
            duration: 3000,
          });
        }
        
        throw error;
      }
      
      // We're not returning data anymore, just handling the OAuth flow
      // The actual auth state change will be captured by the listener
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setAuthLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    authLoading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
};
