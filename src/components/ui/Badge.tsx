'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'muted';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'muted', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variant === 'green' && 'bg-green-900 text-green-300 border border-green-800',
          variant === 'amber' && 'bg-amber-900 text-amber-300 border border-amber-800',
          variant === 'red' && 'bg-red-900 text-red-300 border border-red-800',
          variant === 'blue' && 'bg-blue-900 text-blue-300 border border-blue-800',
          variant === 'purple' && 'bg-purple-900 text-purple-300 border border-purple-800',
          variant === 'muted' && 'bg-gray-700 text-gray-300 border border-gray-600',
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };