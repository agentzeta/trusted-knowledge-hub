
import React from 'react';
import { LogIn, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import ApiKeyManager from './ApiKeyManager';
import { useQueryContext } from '../hooks/useQueryContext';
import { exportToGoogleDocsService } from '../services/exportService';

interface QueryHeaderProps {
  handleGoogleSignIn: () => Promise<void>;
  user: any;
}

const QueryHeader: React.FC<QueryHeaderProps> = ({ handleGoogleSignIn, user }) => {
  const { toast } = useToast();
  const { query, consensusResponse } = useQueryContext();

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
      toast({
        title: "Exporting to Google Docs",
        description: "Please wait while we prepare your document...",
      });

      const result = await exportToGoogleDocsService(query, consensusResponse);
      
      toast({
        title: "Export successful!",
        description: (
          <div className="flex flex-col gap-2">
            <span>Your document has been created.</span>
            <a 
              href={result.documentUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              Open in Google Docs
            </a>
          </div>
        ),
      });
    } catch (error) {
      console.error('Error exporting to Google Docs:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting to Google Docs. Please try again later.",
        variant: "destructive",
      });
    }
  };

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
        
        {user && consensusResponse && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportToGoogleDocs}
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            <span>Export to Docs</span>
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
