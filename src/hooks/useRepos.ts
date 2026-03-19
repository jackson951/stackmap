'use client';

import { useReposContext } from '@/contexts/ReposContext';

export const useRepos = () => {
  const { 
    repos, 
    loading, 
    error, 
    fetchRepos, 
    connectRepo, 
    deleteRepo, 
    indexRepo, 
    clearError 
  } = useReposContext();

  return {
    repos,
    loading,
    error,
    fetchRepos,
    connectRepo,
    deleteRepo,
    indexRepo,
    clearError,
  };
};
