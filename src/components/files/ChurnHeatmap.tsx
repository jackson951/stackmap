'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface ChurnHeatmapProps {
  files: any[];
}

const ChurnHeatmap = ({ files }: ChurnHeatmapProps) => {
  const topFiles = files
    .sort((a, b) => b.commitCount - a.commitCount)
    .slice(0, 10);

  const getMaxCommitCount = () => {
    return Math.max(...files.map(f => f.commitCount), 1);
  };

  const getBarColor = (commitCount: number, maxCount: number) => {
    const percentage = (commitCount / maxCount) * 100;
    if (percentage >= 70) return 'bg-red-500';
    if (percentage >= 40) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const maxCount = getMaxCommitCount();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-red-400">🔥</span>
          <span>High-Churn Files</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topFiles.map((file) => (
            <div key={file.id} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-white font-medium">{file.name}</span>
                <span className="text-gray-400">{file.commitCount} commits</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    getBarColor(file.commitCount, maxCount)
                  )}
                  style={{
                    width: `${(file.commitCount / maxCount) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { ChurnHeatmap };