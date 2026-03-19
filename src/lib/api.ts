import { User, Repo, RepoFile, Query, IndexRepoResponse, QueryRepoResponse, GenerateGuideResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Base fetch wrapper with auth
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('stackmap_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || 'An error occurred';
    } catch {
      errorMessage = response.statusText || 'An error occurred';
    }
    
    // Log the full error details for debugging
    console.error('API Error Details:', {
      url: endpoint,
      status: response.status,
      statusText: response.statusText,
      errorMessage: errorMessage
    });
    
    throw new Error(errorMessage);
  }

  return response.json();
}

// Auth endpoints
export const authApi = {
  getMe: (): Promise<User> => apiFetch('/api/auth/me'),
};

// Repos endpoints
export const reposApi = {
  getRepos: (): Promise<Repo[]> => apiFetch('/api/repos').then((data: any) => data.repos || data),
  connectRepo: (fullName: string): Promise<Repo> => 
    apiFetch('/api/repos/connect', {
      method: 'POST',
      body: JSON.stringify({ fullName }),
    }),
  deleteRepo: (repoId: string): Promise<void> => 
    apiFetch(`/api/repos/${repoId}`, {
      method: 'DELETE',
    }),
};

// Indexing endpoints
export const indexingApi = {
  indexRepo: (repoId: string): Promise<IndexRepoResponse> => 
    apiFetch(`/api/repos/${repoId}/index`, {
      method: 'POST',
    }),
  getRepoFiles: (repoId: string): Promise<RepoFile[]> => 
    apiFetch(`/api/repos/${repoId}/files`).then((data: any) => data.files || data),
};

// Query endpoints
export const queryApi = {
  queryRepo: (repoId: string, question: string): Promise<QueryRepoResponse> => 
    apiFetch(`/api/repos/${repoId}/query`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    }),
  getQueryHistory: (repoId: string): Promise<Query[]> => 
    apiFetch(`/api/repos/${repoId}/queries`).then((data: any) => data.queries || data),
};

// Guide endpoints
export const guideApi = {
  generateGuide: (repoId: string): Promise<GenerateGuideResponse> => 
    apiFetch(`/api/repos/${repoId}/guide`, {
      method: 'POST',
    }),
};