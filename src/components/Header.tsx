
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const Header: React.FC = () => {
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  const handleSignOutClick = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm py-3 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Shield className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold">Truthful</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
            About
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="truncate max-w-[150px]">{user.email}</span>
              </div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={handleSignOutClick}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </motion.div>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleLoginClick}
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
