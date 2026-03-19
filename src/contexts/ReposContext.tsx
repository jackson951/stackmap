'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Repo } from '@/types';
import { reposApi, indexingApi } from '@/lib/api';
import { showToast } from '@/lib/utils';
import { useAuthContext } from './AuthContext';

interface ReposContextType {
  repos: Repo[];
  loading: boolean;
  error: string | null;
  fetchRepos: () => Promise<void>;
  connectRepo: (fullName: string) => Promise<Repo>;
  deleteRepo: (repoId: string) => Promise<void>;
  indexRepo: (repoId: string) => Promise<void>;
  clearError: () => void;
}

const ReposContext = createContext<ReposContextType | undefined>(undefined);

export const useReposContext = () => {
  const context = useContext(ReposContext);
  if (context === undefined) {
    throw new Error('useReposContext must be used within a ReposProvider');
  }
  return context;
};

interface ReposProviderProps {
  children: ReactNode;
}

export const ReposProvider: React.FC<ReposProviderProps> = ({ children }) => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  const clearError = () => setError(null);

  const fetchRepos = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const reposData = await reposApi.getRepos();
      setRepos(reposData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repos';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const connectRepo = useCallback(async (fullName: string): Promise<Repo> => {
    setLoading(true);
    setError(null);
    try {
      const newRepo = await reposApi.connectRepo(fullName);
      setRepos(prev => [...prev, newRepo]);
      showToast('Repository connected successfully', 'success');
      return newRepo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect repository';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRepo = useCallback(async (repoId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await reposApi.deleteRepo(repoId);
      setRepos(prev => prev.filter(repo => repo.id !== repoId));
      showToast('Repository deleted successfully', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete repository';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const indexRepo = useCallback(async (repoId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await indexingApi.indexRepo(repoId);
      setRepos(prev => prev.map(repo => 
        repo.id === repoId 
          ? { ...repo, isIndexed: true, indexedAt: new Date().toISOString() }
          : repo
      ));
      showToast(`Repository indexed successfully. ${result.filesIndexed || 0} files processed.`, 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to index repository';
      setError(errorMessage);
      
      // Provide more specific error messages
      if (errorMessage.includes('500')) {
        showToast('Server error occurred while indexing. Please try again later or contact support.', 'error');
      } else if (errorMessage.includes('timeout')) {
        showToast('Indexing timed out. The repository might be too large. Please try again later.', 'error');
      } else if (errorMessage.includes('permission') || errorMessage.includes('access')) {
        showToast('Access denied. Please check your GitHub permissions and try again.', 'error');
      } else {
        showToast(errorMessage, 'error');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch repos when user changes
  React.useEffect(() => {
    if (user) {
      fetchRepos();
    } else {
      setRepos([]);
    }
  }, [user, fetchRepos]);

  const value: ReposContextType = {
    repos,
    loading,
    error,
    fetchRepos,
    connectRepo,
    deleteRepo,
    indexRepo,
    clearError,
  };

  return (
    <ReposContext.Provider value={value}>
      {children}
    </ReposContext.Provider>
  );
};