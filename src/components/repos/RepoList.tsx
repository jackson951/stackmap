'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { RepoCard } from './RepoCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { GitBranch, Database, Sparkles, Users } from 'lucide-react';
import { Repo } from '@/types';

interface RepoListProps {
  repos: Repo[];
  loading?: boolean;
  onConnect?: () => void;
  showStats?: boolean;
}

const RepoList = ({ repos, loading, onConnect, showStats = true }: RepoListProps) => {
  if (loading) {
    return (
      <div className="grid gap-6 sm:gap-8">
        {/* Responsive Grid: 1 card on mobile, 2 on tablet, 3 on desktop, 4 on large screens */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-72 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-white/10 animate-pulse shadow-lg"
            >
              {/* Skeleton Header */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              {/* Skeleton Content */}
              <div className="px-6 pb-6 space-y-3">
                <div className="h-3 w-1/2 bg-gray-700 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-8 bg-gray-700 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-white/10 rounded-full px-6 py-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">AI-Powered Code Intelligence</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white">
            Ready to explore your codebase?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Connect your GitHub repositories and unlock powerful AI-driven insights, 
            natural language queries, and automated documentation generation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Repository Analysis</h3>
            <p className="text-gray-400">
              Our AI analyzes your entire codebase to understand architecture, dependencies, 
              and patterns automatically.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Auto Onboarding Guide</h3>
            <p className="text-gray-400">
              Generate comprehensive documentation for new team members with one click.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Natural Language Queries</h3>
            <p className="text-gray-400">
              Ask questions about your code in plain English and get precise answers.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <EmptyState
          icon={<GitBranch className="h-16 w-16 text-gray-400" />}
          title="No repositories connected yet"
          description="Connect your first GitHub repository to start exploring your codebase with AI."
          action={{
            label: "Connect Repository",
            onClick: onConnect || (() => {}),
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Header */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Repositories</p>
                <p className="text-2xl font-bold text-white">{repos.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Indexed Repositories</p>
                <p className="text-2xl font-bold text-white">
                  {repos.filter(repo => repo.isIndexed).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Ready for AI Queries</p>
                <p className="text-2xl font-bold text-white">
                  {repos.filter(repo => repo.isIndexed).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Repositories Grid */}
      <div className="grid gap-8">
        {/* Enhanced Responsive Grid: Optimized for all screen sizes */}
        <div className="grid gap-6 sm:gap-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { RepoList };
