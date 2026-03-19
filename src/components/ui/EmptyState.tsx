'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center space-y-4 p-8 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="text-gray-400">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-400 max-w-md">{description}</p>
        )}
        {action && (
          <Button
            variant="primary"
            onClick={action.onClick}
            loading={action.loading}
          >
            {action.label}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export { EmptyState };