
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } finally {
      setAuthLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      return await supabase.auth.signUp({ email, password });
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    try {
      return await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    setAuthLoading(true);
    try {
      return await supabase.auth.signOut();
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    authLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };
};
