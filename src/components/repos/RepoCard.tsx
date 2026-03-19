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
        'group',
        isHovered && 'ring-2 ring-white/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Status Indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div className={cn(
          'w-3 h-3 rounded-full',
          getStatusColor(),
          isIndexing && 'animate-pulse'
        )} />
      </div>

      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-white text-lg font-bold truncate">
                  {repo.name}
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-400 truncate">{repo.fullName}</span>
                  {repo.language && (
                    <Badge variant="blue" className={cn(getLanguageColor(repo.language), 'text-xs')}>
                      {repo.language}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant={repo.isIndexed ? 'green' : 'amber'}
              className="flex items-center space-x-1 text-xs"
            >
              {getStatusIcon()}
              <span>{repo.isIndexed ? 'Indexed' : isIndexing ? 'Indexing...' : 'Not indexed'}</span>
            </Badge>
          </div>
        </div>
        
        <CardDescription className="text-gray-300 leading-relaxed">
          {repo.description ? repo.description : 'No description provided'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* GitHub Link */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">Repository</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://github.com/${repo.fullName}`, '_blank')}
            className="text-gray-300 hover:text-white hover:bg-white/10 text-sm"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View on GitHub
          </Button>
        </div>

        {/* Indexing Action */}
        {!repo.isIndexed && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleIndexRepo}
              loading={isIndexing}
              className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isIndexing ? 'Indexing...' : 'Index Repository'}
            </Button>
          </div>
        )}

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('files')}
            className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium group transition-all duration-200"
          >
            <Database className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Files</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('query')}
            className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium group transition-all duration-200"
          >
            <MessageSquare className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Ask AI</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('guide')}
            className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium group transition-all duration-200"
          >
            <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Guide</span>
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('')}
            className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium group transition-all duration-200"
          >
            <GitBranch className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Details</span>
          </Button>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 gap-2">
          <div className="flex items-center space-x-4 text-xs text-gray-400">
            <span className="flex items-center space-x-1">
              <Code className="h-3 w-3" />
              <span>{repo.language || 'Unknown'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Database className="h-3 w-3" />
              <span>{repo.isIndexed ? 'Indexed' : 'Not indexed'}</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteRepo}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
            >
              Delete
            </Button>
            <span className="text-xs text-gray-500">
              {repo.indexedAt ? `Updated: ${new Date(repo.indexedAt).toLocaleDateString()}` : 'Not indexed'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { RepoCard };
