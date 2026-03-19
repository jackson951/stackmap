'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRepos } from '@/hooks/useRepos';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatFileSize, formatDate } from '@/lib/utils';
import { 
  FileText, 
  Database, 
  GitBranch, 
  MessageSquare,
  ExternalLink 
} from 'lucide-react';

export default function RepoOverviewPage() {
  const router = useRouter();
  const params = useParams();
  const repoId = params.repoId as string;
  const { user, logout } = useAuth();
  const { repos, fetchRepos } = useRepos();
  
  const [repo, setRepo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepo = async () => {
      setLoading(true);
      try {
        await fetchRepos();
      } finally {
        setLoading(false);
      }
    };
    loadRepo();
  }, [fetchRepos]);

  useEffect(() => {
    if (repos.length > 0) {
      const foundRepo = repos.find(r => r.id === repoId);
      if (foundRepo) {
        setRepo(foundRepo);
      } else {
        // If repo not found, redirect to dashboard
        router.push('/dashboard');
      }
    }
  }, [repos, repoId, router]);

  const handleIndexRepo = async () => {
    // This would trigger indexing - implementation depends on your hook
    console.log('Indexing repo:', repoId);
  };

  const handleViewFiles = () => {
    router.push(`/repo/${repoId}/files`);
  };

  const handleAskAI = () => {
    router.push(`/repo/${repoId}/query`);
  };

  const handleViewGuide = () => {
    router.push(`/repo/${repoId}/guide`);
  };

  if (loading || !repo) {
    return (
      <AppShell user={user} onLogout={logout}>
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer" onClick={() => router.push('/dashboard')}>
              Dashboard
            </span>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">{repo.name}</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{repo.name}</h1>
                <Badge variant="muted">{repo.language || 'Unknown'}</Badge>
                <Badge variant={repo.isIndexed ? "green" : "amber"}>
                  {repo.isIndexed ? 'Indexed' : 'Not indexed'}
                </Badge>
              </div>
              <p className="text-gray-400">{repo.description || 'No description available'}</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>Created {formatDate(repo.createdAt)}</span>
                {repo.indexedAt && (
                  <span>Indexed {formatDate(repo.indexedAt)}</span>
                )}
              </div>
            </div>
            <div className="flex space-x-3">
              {!repo.isIndexed && (
                <Button
                  onClick={handleIndexRepo}
                  variant="primary"
                  className="flex items-center space-x-2"
                >
                  <Database className="w-4 h-4" />
                  <span>Index Now</span>
                </Button>
              )}
              <Button
                onClick={handleViewFiles}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Explore Files</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-300">
                <GitBranch className="w-5 h-5" />
                <span>Repository</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Full Name</span>
                  <span className="text-white font-mono">{repo.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Language</span>
                  <span className="text-white">{repo.language || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge variant={repo.isIndexed ? "green" : "amber"}>
                    {repo.isIndexed ? 'Indexed' : 'Not indexed'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-300">
                <Database className="w-5 h-5" />
                <span>Indexing</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <Badge variant={repo.isIndexed ? "green" : "amber"}>
                    {repo.isIndexed ? 'Complete' : 'Pending'}
                  </Badge>
                </div>
                {repo.indexedAt ? (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Indexed</span>
                    <span className="text-white">{formatDate(repo.indexedAt)}</span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">
                    Repository not yet indexed. Click "Index Now" to start.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-300">
                <MessageSquare className="w-5 h-5" />
                <span>AI Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={handleAskAI}
                  variant="primary"
                  className="w-full justify-start"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI a Question
                </Button>
                <Button
                  onClick={handleViewGuide}
                  variant="secondary"
                  className="w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Onboarding Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span>Recent Questions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* This would be populated with actual query history */}
              <div className="text-gray-400 text-center py-8">
                No recent queries yet. <br />
                <button 
                  onClick={handleAskAI}
                  className="text-indigo-400 hover:text-indigo-300 underline mt-2"
                >
                  Ask your first question
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}