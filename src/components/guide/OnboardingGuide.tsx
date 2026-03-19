'use client';

import { useState } from 'react';
import { Download, Copy, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface OnboardingGuideProps {
  guide: string;
  onRegenerate: () => void;
  loading?: boolean;
}

const OnboardingGuide = ({ guide, onRegenerate, loading }: OnboardingGuideProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(guide);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadGuide = () => {
    const blob = new Blob([guide], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onboarding-guide.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Handle headings
        if (line.startsWith('# ')) {
          return (
            <h1 key={index} className="text-2xl font-bold text-white border-t border-gray-700 pt-6 mt-6">
              {line.replace('# ', '')}
            </h1>
          );
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-semibold text-indigo-400 border-t border-gray-700 pt-4 mt-4">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-medium text-white">
              {line.replace('### ', '')}
            </h3>
          );
        }
        
        // Handle code blocks
        if (line.startsWith('```')) {
          return (
            <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-4 my-4">
              <code className="text-sm text-gray-300">{line}</code>
            </div>
          );
        }
        
        // Handle inline code
        if (line.includes('`')) {
          return (
            <p key={index} className="text-gray-300 leading-relaxed mb-2">
              {line.replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>')}
            </p>
          );
        }
        
        // Handle lists
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={index} className="text-gray-300 leading-relaxed mb-1 ml-4">
              {line.replace(/^- /, '').replace(/^\* /, '')}
            </li>
          );
        }
        
        // Handle regular paragraphs
        return (
          <p key={index} className="text-gray-300 leading-relaxed mb-2">
            {line}
          </p>
        );
      });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-indigo-400" />
          <div>
            <CardTitle className="text-white">Onboarding Guide</CardTitle>
            <p className="text-sm text-gray-400">Generated for new developers</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy Guide'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadGuide}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download .md</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRegenerate}
            loading={loading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-invert max-w-none">
          {renderMarkdown(guide)}
        </div>
      </CardContent>
    </Card>
  );
};

export { OnboardingGuide };
