'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useRepos } from '@/hooks/useRepos';
import { getLanguageColor } from '@/lib/utils';
import {
  GitBranch,
  FileText,
  MessageSquare,
  ExternalLink,
  Database,
  Code,
  Sparkles,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface RepoCardProps {
  repo: {
    id: string;
    name: string;
    fullName: string;
    description?: string;
    language?: string;
    isIndexed: boolean;
    indexedAt?: string;
  };
}

const RepoCard = ({ repo }: RepoCardProps) => {
  const router = useRouter();
  const { indexRepo, deleteRepo } = useRepos();
  const [isIndexing, setIsIndexing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleIndexRepo = async () => {
    setIsIndexing(true);
    try {
      await indexRepo(repo.id);
      // Success is handled by the context
    } catch (error) {
      console.error('Failed to index repo:', error);
      // Error is handled by the context with toast notification
    } finally {
      setIsIndexing(false);
    }
  };

  const handleDeleteRepo = async () => {
    if (confirm('Are you sure you want to delete this repository?')) {
      try {
        await deleteRepo(repo.id);
      } catch (error) {
        console.error('Failed to delete repo:', error);
      }
    }
  };

  const handleNavigate = (path: string) => {
    router.push(`/repo/${repo.id}/${path}`);
  };

  const getStatusIcon = () => {
    if (isIndexing) return <Clock className="h-4 w-4 animate-spin" />;
    if (repo.isIndexed) return <CheckCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getStatusColor = () => {
    if (isIndexing) return 'text-yellow-400';
    if (repo.isIndexed) return 'text-green-400';
    return 'text-orange-400';
  };

  return (
    <Card 
      className={cn(
        'h-full hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30',
        'bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10',
        'group relative overflow-hidden',
        isHovered && 'ring-2 ring-white/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Status Indicator - Fixed positioning */}
      <div className="absolute top-3 right-3 z-50">
        <div className={cn(
          'w-4 h-4 rounded-full border-2 border-white/50',
          getStatusColor(),
          isIndexing && 'animate-pulse',
          'shadow-lg shadow-black/50'
        )} />
      </div>

      {/* Enhanced Header Section */}
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/25">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-white text-xl font-bold truncate">
                    {repo.name}
                  </CardTitle>
                  <Badge 
                    variant={repo.isIndexed ? 'green' : 'amber'}
                    className="flex items-center space-x-2 text-sm font-medium"
                  >
                    {getStatusIcon()}
                    <span>{repo.isIndexed ? 'Indexed' : isIndexing ? 'Indexing...' : 'Not indexed'}</span>
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300 font-mono">{repo.fullName}</span>
                  {repo.language && (
                    <Badge variant="blue" className={cn(getLanguageColor(repo.language), 'text-xs px-2 py-1')}>
                      {repo.language}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <CardDescription className="text-gray-300 leading-relaxed text-base">
          {repo.description ? repo.description : 'No description provided for this repository.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Repository Info Section */}
        <div className="flex items-center justify-between py-3 border-t border-white/10">
          <div className="flex items-center space-x-6 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4 text-cyan-400" />
              <span className="font-medium">Language:</span>
              <span className="text-gray-400">{repo.language || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-indigo-400" />
              <span className="font-medium">Status:</span>
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                repo.isIndexed ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                isIndexing ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              )}>
                {repo.isIndexed ? 'Indexed' : isIndexing ? 'Indexing...' : 'Not indexed'}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://github.com/${repo.fullName}`, '_blank')}
            className="text-gray-300 hover:text-white hover:bg-white/10 text-sm font-medium group"
          >
            <ExternalLink className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
            View on GitHub
          </Button>
        </div>

        {/* Indexing Action */}
        {!repo.isIndexed && (
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleIndexRepo}
              loading={isIndexing}
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold text-lg py-4 shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="h-5 w-5 mr-3" />
              {isIndexing ? 'Indexing Repository...' : 'Index Repository Now'}
            </Button>
          </div>
        )}

        {/* Action Buttons Grid - Enhanced */}
        <div className="grid grid-cols-2 gap-3 pt-6">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleNavigate('files')}
            className="flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold text-base py-4 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Files</div>
              <div className="text-xs text-gray-400">Explore codebase</div>
            </div>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleNavigate('query')}
            className="flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold text-base py-4 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Ask AI</div>
              <div className="text-xs text-gray-400">Natural language queries</div>
            </div>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleNavigate('guide')}
            className="flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold text-base py-4 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Guide</div>
              <div className="text-xs text-gray-400">Auto-generated docs</div>
            </div>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleNavigate('')}
            className="flex items-center justify-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold text-base py-4 group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-black/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-bold">Details</div>
              <div className="text-xs text-gray-400">Repository info</div>
            </div>
          </Button>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-white/10 gap-4">
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Code className="h-4 w-4 text-cyan-400" />
              <span><strong>Language:</strong> {repo.language || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-indigo-400" />
              <span><strong>Indexed:</strong> {repo.isIndexed ? 'Yes' : 'No'}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteRepo}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium px-4 py-2"
            >
              Delete Repository
            </Button>
            <div className="text-sm text-gray-500 font-mono">
              {repo.indexedAt ? `Last updated: ${new Date(repo.indexedAt).toLocaleDateString()}` : 'Not indexed'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { RepoCard };
