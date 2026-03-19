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
        'group relative overflow-hidden cursor-pointer',
        isHovered && 'ring-2 ring-white/20'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => handleNavigate('')}
    >
      {/* Floating Status Indicator */}
      <div className="absolute top-3 right-3 z-50">
        <div className={cn(
          'w-3 h-3 rounded-full border-2 border-white/50',
          getStatusColor(),
          isIndexing && 'animate-pulse',
          'shadow-lg shadow-black/50'
        )} />
      </div>

      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Code className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-white text-lg font-semibold truncate">
                {repo.name}
              </CardTitle>
              <CardDescription className="text-gray-400 text-sm truncate">
                {repo.fullName}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={repo.isIndexed ? 'green' : 'amber'}
            className="text-xs font-medium"
          >
            {getStatusIcon()}
            <span>{repo.isIndexed ? 'Indexed' : isIndexing ? 'Indexing...' : 'Not indexed'}</span>
          </Badge>
        </div>
        
        {repo.description && (
          <CardDescription className="text-gray-300 text-sm line-clamp-2">
            {repo.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Language Badge */}
        {repo.language && (
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Code className="h-3 w-3 text-cyan-400" />
            <span>{repo.language}</span>
          </div>
        )}

        {/* Action Buttons - Minimal */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate('files');
            }}
            className="text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/20 text-white group"
          >
            <Database className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform" />
            Files
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate('query');
            }}
            className="text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/20 text-white group"
          >
            <MessageSquare className="h-3 w-3 mr-1 group-hover:scale-110 transition-transform" />
            Ask AI
          </Button>
        </div>

        {/* Index Action - Only when needed */}
        {!repo.isIndexed && (
          <div className="pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleIndexRepo();
              }}
              loading={isIndexing}
              className="w-full text-xs font-medium bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              {isIndexing ? 'Indexing...' : 'Index Now'}
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-xs text-gray-500">
            {repo.indexedAt ? `Updated: ${new Date(repo.indexedAt).toLocaleDateString()}` : 'Not indexed'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteRepo();
            }}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { RepoCard };
