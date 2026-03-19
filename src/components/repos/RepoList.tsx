'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { RepoCard } from './RepoCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { GitBranch } from 'lucide-react';
import { Repo } from '@/types';

interface RepoListProps {
  repos: Repo[];
  loading?: boolean;
  onConnect?: () => void;
}

const RepoList = ({ repos, loading, onConnect }: RepoListProps) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-gray-800 rounded-xl border border-gray-700 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <EmptyState
        icon={<GitBranch className="h-12 w-12 text-gray-400" />}
        title="No repositories connected yet"
        description="Connect your first GitHub repository to start exploring your codebase with AI."
        action={{
          label: "Connect Repository",
          onClick: onConnect || (() => {}),
        }}
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
};

export { RepoList };