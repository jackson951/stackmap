'use client';

import { useCallback } from 'react';
import { showToast } from '@/lib/utils';

export const useToast = () => {
  const showToastMessage = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    showToast(message, type);
  }, []);

  return {
    showToast: showToastMessage,
  };
};