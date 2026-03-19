'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRepos } from '@/hooks/useRepos';
import { AppShell } from '@/components/layout/AppShell';
import { RepoList } from '@/components/repos/RepoList';
import { ConnectRepoModal } from '@/components/repos/ConnectRepoModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/lib/utils';
import { Plus, GitBranch, Database, FileText } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, logout, login } = useAuthContext();
  const { repos, loading: reposLoading, fetchRepos, connectRepo } = useRepos();
  
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);

  // Handle token from URL
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Login with the token
      login(token);
      // Remove token from URL
      router.replace('/dashboard');
      showToast('Successfully connected to GitHub!', 'success');
    }
  }, [searchParams, router, login]);

  // Fetch repos when user is available
  useEffect(() => {
    if (user && !authLoading) {
      fetchRepos();
    }
  }, [user, authLoading, fetchRepos]);

  const handleConnectRepo = async (fullName: string) => {
    setConnectLoading(true);
    try {
      await connectRepo(fullName);
      setShowConnectModal(false);
      showToast('Repository connected successfully!', 'success');
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setConnectLoading(false);
    }
  };

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.username}</p>
            </div>
            <Button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Repo</span>
            </Button>
          </div>
        </div>

        {reposLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : repos.length === 0 ? (
          <EmptyState
            icon={<GitBranch className="w-16 h-16 text-gray-400" />}
            title="No repositories connected yet"
            description="Connect your first GitHub repository to start mapping your codebase with AI."
            action={{
              label: "Connect Your First Repo",
              onClick: () => setShowConnectModal(true)
            }}
          />
        ) : (
          <RepoList repos={repos} onConnect={() => setShowConnectModal(true)} />
        )}

        <ConnectRepoModal
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
          onConnect={handleConnectRepo}
          loading={connectLoading}
        />
      </div>
    </AppShell>
  );
}