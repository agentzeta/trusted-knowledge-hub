
import React, { useState } from 'react';
import { LogIn, Settings, FileText, Loader2, Upload, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ApiKeyManager from './ApiKeyManager';
import { useQueryContext } from '../hooks/useQueryContext';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';

interface QueryHeaderProps {
  handleGoogleSignIn: () => Promise<void>;
  user: any;
}

const QueryHeader: React.FC<QueryHeaderProps> = ({ handleGoogleSignIn, user }) => {
  const { toast } = useToast();
  const { query, consensusResponse, exportToGoogleDocs } = useQueryContext();
  const { authLoading, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportToGoogleDocs = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export to Google Docs",
        variant: "destructive",
      });
      return;
    }

    if (!query || !consensusResponse) {
      toast({
        title: "No content to export",
        description: "Please run a query first to generate content for export",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      toast({
        title: "Exporting to Google Docs",
        description: "Please wait while we prepare your document...",
      });

      await exportToGoogleDocs();
      
      toast({
        title: "Export successful!",
        description: "Your document has been created and opened in a new tab.",
      });
    } catch (error: any) {
      console.error('Error exporting to Google Docs:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting to Google Docs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-medium">Ask a question</h2>
      <div className="flex items-center gap-2">
        {!user && (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleGoogleSignIn}
              className="flex items-center gap-1"
              disabled={authLoading}
            >
              {authLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              <span>{authLoading ? 'Signing in...' : 'Sign in'}</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1"
            >
              <UserPlus className="h-4 w-4" />
              <span>Sign up</span>
            </Button>
          </>
        )}
        
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportToGoogleDocs} disabled={isExporting || !consensusResponse}>
                <Upload className="mr-2 h-4 w-4" />
                <span>{isExporting ? 'Exporting...' : 'Export to Google Docs'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
                <LogIn className="mr-2 h-4 w-4 rotate-180" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
