
import React, { useState } from 'react';
import AuthForm from '../components/auth/AuthForm';
import SignUpForm from '../components/auth/SignUpForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  return (
    <div className="container mx-auto py-16">
      <div className="w-full max-w-md mx-auto">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <AuthForm />
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <SignUpForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
