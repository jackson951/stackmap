'use client';

import { useQueryContext } from '@/contexts/QueryContext';

export const useQuery = () => {
  const { 
    answer, 
    filesReferenced, 
    loading, 
    error, 
    history, 
    submitQuery, 
    fetchHistory, 
    clearError, 
    clearQuery 
  } = useQueryContext();

  return {
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
};
