'use client';

import { useState } from 'react';
import { Copy, FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface QueryResultProps {
  answer: string;
  filesReferenced: string[];
}

const QueryResult = ({ answer, filesReferenced }: QueryResultProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for bold and code blocks
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')
      .split('\n')
      .map((line, index) => (
        <p key={index} className="mb-2 text-gray-300 leading-relaxed">
          {line}
        </p>
      ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <FileText className="w-5 h-5 text-indigo-400 mr-2" />
          AI Answer
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center space-x-2"
        >
          <Copy className="w-4 h-4" />
          <span>{copied ? 'Copied!' : 'Copy Answer'}</span>
        </Button>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="prose prose-invert max-w-none">
          {renderMarkdown(answer)}
        </div>
      </div>

      {filesReferenced.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-400">Files Referenced</h4>
          <div className="flex flex-wrap gap-2">
            {filesReferenced.map((file, index) => (
              <Badge key={index} variant="muted" className="flex items-center space-x-1">
                <FileText className="w-3 h-3" />
                <span className="text-sm">{file}</span>
                <ExternalLink className="w-3 h-3" />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { QueryResult };
