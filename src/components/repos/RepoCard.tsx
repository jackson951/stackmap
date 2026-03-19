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

  return (
    <Card className="h-full hover:border-gray-600 transition-colors">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">{repo.name}</CardTitle>
          <div className="flex items-center space-x-2">
            {repo.language && (
              <Badge variant="blue" className={getLanguageColor(repo.language)}>
                {repo.language}
              </Badge>
            )}
            <Badge variant={repo.isIndexed ? 'green' : 'amber'}>
              {repo.isIndexed ? 'Indexed' : 'Not indexed'}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-gray-400">
          {repo.description ? repo.description : 'No description provided'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{repo.fullName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(`https://github.com/${repo.fullName}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on GitHub
          </Button>
        </div>

        {!repo.isIndexed && (
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleIndexRepo}
              loading={isIndexing}
            >
              <GitBranch className="h-4 w-4 mr-2" />
              Index Now
            </Button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('')}
            className="w-full"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('files')}
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Files
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('query')}
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Ask AI
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleNavigate('guide')}
            className="w-full"
          >
            <GitBranch className="h-4 w-4 mr-2" />
            Guide
          </Button>
        </div>

        <div className="flex justify-between items-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteRepo}
            className="text-red-400 hover:text-red-300"
          >
            Delete
          </Button>
          <span className="text-xs text-gray-500">
            {repo.indexedAt ? `Indexed: ${new Date(repo.indexedAt).toLocaleDateString()}` : 'Not indexed'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export { RepoCard };