'use client';

import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const { user, loading, error, logout, clearError } = useAuthContext();

  return { 
    user, 
    loading, 
    error, 
    logout, 
    clearError 
  };
};
