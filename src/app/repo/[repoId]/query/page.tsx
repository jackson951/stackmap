'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { queryApi } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/lib/utils';
import { QueryInput } from '@/components/query/QueryInput';
import { QueryResult } from '@/components/query/QueryResult';
import { QueryHistory } from '@/components/query/QueryHistory';
import { DynamicBreadcrumb } from '@/components/layout/Breadcrumb';
import { MessageSquare, FileText, ExternalLink } from 'lucide-react';

export default function QueryPage() {
  const router = useRouter();
  const params = useParams();
  const repoId = params.repoId as string;
  const { user, logout } = useAuth();
  
  const [answer, setAnswer] = useState('');
  const [filesReferenced, setFilesReferenced] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);

  useEffect(() => {
    loadHistory();
  }, [repoId]);

  const loadHistory = async () => {
    try {
      const historyData = await queryApi.getQueryHistory(repoId);
      setHistory(historyData);
    } catch (error) {
      console.error('Failed to load query history:', error);
      showToast('Failed to load query history', 'error');
    }
  };

  const handleSubmitQuery = async (question: string) => {
    setLoading(true);
    setAnswer('');
    setFilesReferenced([]);
    setSelectedQuery(null);
    
    try {
      const result = await queryApi.queryRepo(repoId, question);
      setAnswer(result.answer);
      setFilesReferenced(result.filesReferenced);
      showToast('Query completed successfully', 'success');
      await loadHistory();
    } catch (error) {
      console.error('Failed to submit query:', error);
      showToast('Failed to submit query', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuery = (query: any) => {
    setSelectedQuery(query);
    setAnswer(query.answer);
    setFilesReferenced(query.filesReferenced);
  };

  const handleViewFiles = () => {
    router.push(`/repo/${repoId}/files`);
  };

  const handleViewGuide = () => {
    router.push(`/repo/${repoId}/guide`);
  };

  return (
    <AppShell user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <DynamicBreadcrumb currentPath="/repo/[repoId]/query" />

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Ask about this codebase</h1>
              <p className="text-gray-400 mt-1">Get intelligent answers about your repository</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleViewFiles}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Explore Files</span>
              </Button>
              <Button
                onClick={handleViewGuide}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>View Guide</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Query Interface */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <span>Ask StackMap</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QueryInput
                  onQuery={handleSubmitQuery}
                  loading={loading}
                  suggestedQuestions={[
                    "Where does authentication happen?",
                    "What handles API requests?",
                    "Where is the database logic?",
                    "What are the main entry points?"
                  ]}
                />
                
                {loading && (
                  <div className="mt-4 flex items-center justify-center space-x-2 text-gray-400">
                    <Spinner size="sm" />
                    <span>StackMap is analyzing your codebase...</span>
                  </div>
                )}
                
                {answer && (
                  <div className="mt-6">
                    <QueryResult
                      answer={answer}
                      filesReferenced={filesReferenced}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Query History */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span>Previous Questions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QueryHistory
                  queries={history}
                  onSelectQuery={handleSelectQuery}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}