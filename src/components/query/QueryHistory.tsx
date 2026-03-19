'use client';

import { Query } from '@/types';
import { Clock, MessageSquare, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

interface QueryHistoryProps {
  queries: Query[];
  onSelectQuery: (query: Query) => void;
}

const QueryHistory = ({ queries, onSelectQuery }: QueryHistoryProps) => {
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Clock className="w-5 h-5 text-indigo-400 mr-2" />
          Previous Questions
        </h3>
        <span className="text-sm text-gray-400">{queries.length} queries</span>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {queries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No previous queries yet. Ask your first question!
          </div>
        ) : (
          queries.map((query) => (
            <div
              key={query.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
              onClick={() => onSelectQuery(query)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-gray-300 font-medium">Question</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed">
                    {query.question}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">{formatTimeAgo(query.createdAt)}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs text-gray-400">
                      {query.filesReferenced.length} file{query.filesReferenced.length !== 1 ? 's' : ''} referenced
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-indigo-400 hover:text-white"
                  >
                    View Answer
                  </Button>
                </div>
                
                {query.filesReferenced.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {query.filesReferenced.slice(0, 3).map((file, index) => (
                      <Badge key={index} variant="muted" className="text-xs">
                        {file}
                      </Badge>
                    ))}
                    {query.filesReferenced.length > 3 && (
                      <Badge variant="muted" className="text-xs">
                        +{query.filesReferenced.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export { QueryHistory };
