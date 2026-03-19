'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { indexingApi } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/lib/utils';
import { FileTree } from '@/components/files/FileTree';
import { ChurnHeatmap } from '@/components/files/ChurnHeatmap';
import { Database, FileText, RefreshCw } from 'lucide-react';

export default function FileExplorerPage() {
  const router = useRouter();
  const params = useParams();
  const repoId = params.repoId as string;
  const { user, logout } = useAuth();
  
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexing, setIndexing] = useState(false);

  useEffect(() => {
    loadFiles();
  }, [repoId]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const filesData = await indexingApi.getRepoFiles(repoId);
      setFiles(filesData);
    } catch (error) {
      console.error('Failed to load files:', error);
      showToast('Failed to load files', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleIndexRepo = async () => {
    setIndexing(true);
    try {
      await indexingApi.indexRepo(repoId);
      showToast('Repository indexed successfully', 'success');
      await loadFiles();
    } catch (error) {
      console.error('Failed to index repository:', error);
      showToast('Failed to index repository', 'error');
    } finally {
      setIndexing(false);
    }
  };

  const handleViewQuery = () => {
    router.push(`/repo/${repoId}/query`);
  };

  const handleViewGuide = () => {
    router.push(`/repo/${repoId}/guide`);
  };

  if (loading && files.length === 0) {
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
            <span className="hover:text-white cursor-pointer" onClick={() => router.push(`/repo/${repoId}`)}>
              Repository
            </span>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Files</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">File Explorer</h1>
              <p className="text-gray-400 mt-1">Explore and analyze your codebase structure</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleIndexRepo}
                variant="primary"
                loading={indexing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${indexing ? 'animate-spin' : ''}`} />
                <span>{indexing ? 'Indexing...' : 'Re-index'}</span>
              </Button>
              <Button
                onClick={handleViewQuery}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Ask AI</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Churn Heatmap */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-red-400" />
                  <span>High-Churn Files</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {files.length > 0 ? (
                  <ChurnHeatmap files={files} />
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No files found. <br />
                    <button 
                      onClick={handleIndexRepo}
                      className="text-indigo-400 hover:text-indigo-300 underline mt-2"
                    >
                      Index repository to see files
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - File Tree */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span>Full File Tree</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {files.length > 0 ? (
                  <FileTree files={files} />
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No files found. <br />
                    <button 
                      onClick={handleIndexRepo}
                      className="text-indigo-400 hover:text-indigo-300 underline mt-2"
                    >
                      Index repository to see files
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}