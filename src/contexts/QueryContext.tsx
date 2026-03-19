'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Query, QueryRepoResponse } from '@/types';
import { queryApi } from '@/lib/api';
import { showToast } from '@/lib/utils';

interface QueryContextType {
  answer: string;
  filesReferenced: string[];
  loading: boolean;
  error: string | null;
  history: Query[];
  submitQuery: (repoId: string, question: string) => Promise<QueryRepoResponse>;
  fetchHistory: (repoId: string) => Promise<void>;
  clearError: () => void;
  clearQuery: () => void;
}

const QueryContext = createContext<QueryContextType | undefined>(undefined);

export const useQueryContext = () => {
  const context = useContext(QueryContext);
  if (context === undefined) {
    throw new Error('useQueryContext must be used within a QueryProvider');
  }
  return context;
};

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [answer, setAnswer] = useState<string>('');
  const [filesReferenced, setFilesReferenced] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Query[]>([]);

  const clearError = () => setError(null);

  const clearQuery = () => {
    setAnswer('');
    setFilesReferenced([]);
    setError(null);
  };

  const submitQuery = useCallback(async (repoId: string, question: string): Promise<QueryRepoResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result: QueryRepoResponse = await queryApi.queryRepo(repoId, question);
      setAnswer(result.answer);
      setFilesReferenced(result.filesReferenced);
      showToast('Query completed successfully', 'success');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit query';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (repoId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const historyData = await queryApi.getQueryHistory(repoId);
      setHistory(historyData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch query history';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const value: QueryContextType = {
    answer,
    filesReferenced,
    loading,
    error,
    history,
    submitQuery,
    fetchHistory,
    clearError,
    clearQuery,
  };

  return (
    <QueryContext.Provider value={value}>
      {children}
    </QueryContext.Provider>
  );
};