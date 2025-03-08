
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Auth = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="blur-background">
        <div className="blur-circle bg-blue-300 w-[500px] h-[500px] top-[-100px] left-[-200px]" />
        <div className="blur-circle bg-purple-300 w-[400px] h-[400px] bottom-[-100px] right-[-150px]" />
      </div>
      
      <div className="max-w-md w-full space-y-8 z-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to Truthful</h2>
          <p className="mt-2 text-gray-600">Sign in or create an account to continue</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
