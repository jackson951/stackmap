'use client';

import { cn } from '@/lib/utils';
import { RepoFile } from '@/types';

interface ChurnHeatmapProps {
  files: RepoFile[];
}

const ChurnHeatmap = ({ files }: ChurnHeatmapProps) => {
  if (files.length === 0) {
    return (
      <div className="text-sm text-gray-400">
        No churn data available yet. Index your repo to unlock insights.
      </div>
    );
  }

  const validFiles = files.filter(file => typeof file.commitCount === 'number' && file.commitCount >= 0);
  const topFiles = validFiles
    .sort((a, b) => (b.commitCount || 0) - (a.commitCount || 0))
    .slice(0, 6);

  const maxCommits = validFiles.reduce(
    (max, file) => Math.max(max, file.commitCount || 0),
    0
  ) || 1;

  const getHeatColor = (value: number) => {
    const intensity = Math.min(100, (value / maxCommits) * 100);
    if (intensity >= 75) return 'bg-gradient-to-r from-rose-500 to-red-600';
    if (intensity >= 50) return 'bg-gradient-to-r from-amber-500 to-orange-500';
    return 'bg-gradient-to-r from-sky-500 to-cyan-500';
  };

  return (
    <div className="space-y-4">
      {topFiles.map((file) => {
        const commits = file.commitCount || 0;
        return (
          <div key={file.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs uppercase tracking-wider text-gray-400">
              <span className="font-semibold text-white truncate">{file.name}</span>
              <span>{commits} commits</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  getHeatColor(commits)
                )}
                style={{ width: `${Math.min(100, (commits / maxCommits) * 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-500 flex justify-between">
              <span>{file.path}</span>
              <span>{Math.round((commits / maxCommits) * 100)}% heat</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export { ChurnHeatmap };
