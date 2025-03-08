
import { useContext } from 'react';
import { QueryContext } from '../context/QueryContext';
import { QueryContextType } from '../types/query';

export const useQueryContext = (): QueryContextType => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQueryContext must be used within a QueryProvider');
  }
  return context;
};
