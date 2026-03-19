export interface User {
  id: string;
  githubId: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  user:{
      id: string;
      githubId: string;
      username: string;
      email?: string;
      avatarUrl?: string;
     }
}

export interface Repo {
  id: string;
  userId: string;
  githubRepoId: string;
  name: string;
  fullName: string;
  description?: string;
  language?: string;
  isIndexed: boolean;
  indexedAt?: string;
  createdAt: string;
}

export interface RepoFile {
  id: string;
  repoId: string;
  path: string;
  name: string;
  extension?: string;
  size?: number;
  commitCount: number;
  summary?: string;
}

export interface Query {
  id: string;
  repoId: string;
  question: string;
  answer: string;
  filesReferenced: string[];
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  error: string;
}

export interface IndexRepoResponse {
  success: boolean;
  filesIndexed: number;
}

export interface QueryRepoResponse {
  answer: string;
  filesReferenced: string[];
  queryId: string;
}

export interface GenerateGuideResponse {
  guide: string;
}