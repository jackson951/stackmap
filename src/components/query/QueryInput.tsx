'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface QueryInputProps {
  onQuery: (question: string) => void;
  loading?: boolean;
  suggestedQuestions?: string[];
}

const QueryInput = ({ onQuery, loading, suggestedQuestions = [] }: QueryInputProps) => {
  const [question, setQuestion] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onQuery(question.trim());
      setQuestion('');
    }
  };

  const handleSuggestedQuestion = (q: string) => {
    setQuestion(q);
    onQuery(q);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ask about this codebase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedQuestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(q)}
                  className="text-gray-300 hover:text-white border border-gray-600"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className={cn(
              'w-full min-h-[120px] rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
              'resize-none'
            )}
            placeholder="What would you like to know about this codebase?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
          
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!question.trim() || loading}
            >
              Ask StackMap
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export { QueryInput };