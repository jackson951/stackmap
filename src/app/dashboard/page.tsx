'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRepos } from '@/hooks/useRepos';
import { AppShell } from '@/components/layout/AppShell';
import { RepoList } from '@/components/repos/RepoList';
import { ConnectRepoModal } from '@/components/repos/ConnectRepoModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { showToast } from '@/lib/utils';
import { Plus, GitBranch, Database, FileText, Sparkles, Globe } from 'lucide-react';

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

  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const dashboardStats = useMemo(() => {
    const indexedCount = repos.filter(repo => repo.isIndexed).length;
    const languageCounts: Record<string, number> = {};
    const sortedRepos = [...repos].sort((a, b) => {
      if (!a.indexedAt || !b.indexedAt) return 0;
      return new Date(b.indexedAt).getTime() - new Date(a.indexedAt).getTime();
    });
    const recentRepo = sortedRepos[0];

    repos.forEach(repo => {
      const languageKey = repo.language || 'Unspecified';
      languageCounts[languageKey] = (languageCounts[languageKey] || 0) + 1;
    });

    return {
      totalRepos: repos.length,
      indexedCount,
      primaryLanguage: recentRepo?.language || 'Awaiting indexing',
      topLanguage: Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unspecified',
      recentRepoName: recentRepo?.name,
    };
    return {
      totalRepos: repos.length,
      indexedCount,
      primaryLanguage: recentRepo?.language || 'Awaiting indexing',
      topLanguage: Object.entries(languageCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Unspecified',
      recentRepoName: recentRepo?.name,
    };
  }, [repos]);

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

  const handleReviewQueries = () => {
    if (!repos.length) {
      showToast('Connect a repository before asking questions', 'info');
      setShowConnectModal(true);
      return;
    }

    router.push(`/repo/${repos[0].id}/query`);
  };

  return (
    <AppShell user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.6em] text-indigo-400">StackMap Command Center</p>
              <h1 className="text-4xl font-bold text-white">Dashboard</h1>
              <p className="text-gray-300 max-w-3xl">
                {user?.username ? `Welcome back, ${user.username}.` : ''}
                {' '}
                Real-time intelligence on every connected repository with guided next steps, reusable flows, and AI-ready outputs.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setShowConnectModal(true)}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Connect Repository</span>
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleReviewQueries}
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Review AI Queries</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 border border-white/20 text-white bg-white/5"
                  onClick={() => router.push('/profile')}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Update Profile</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.5em] text-gray-400">Connected</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.totalRepos}</p>
                <p className="text-[11px] text-gray-400">repositories live</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.5em] text-gray-400">Indexed</p>
                <p className="text-2xl font-bold text-white">{dashboardStats.indexedCount}</p>
                <p className="text-[11px] text-gray-400">ready for AI</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.5em] text-gray-400">Primary stack</p>
                <p className="text-xl font-semibold text-white">{dashboardStats.primaryLanguage}</p>
                <p className="text-[11px] text-gray-400">{dashboardStats.topLanguage} dominance</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
          <div className="space-y-6">
            <Card className="border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl shadow-black/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Connected Repositories</h2>
                    <p className="text-sm text-gray-400">Live data from GitHub, ready for AI ops.</p>
                  </div>
                  <Badge variant="muted" className="px-3 py-1 text-xs">Last synced: {reposLoading ? 'pending' : 'fresh'}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {reposLoading ? (
                  <div className="flex items-center justify-center py-12">
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
                  <RepoList repos={repos} onConnect={() => setShowConnectModal(true)} showStats={false} />
                )}
              </CardContent>
            </Card>
          </div>

        </div>


        <ConnectRepoModal
          isOpen={showConnectModal}
          onClose={() => setShowConnectModal(false)}
          onConnect={() => setShowConnectModal(true)}
          loading={connectLoading}
        />
      </div>
    </AppShell>
  );
}
