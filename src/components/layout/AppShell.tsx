'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, children, user, onLogout, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('min-h-screen bg-gray-900', className)}
        {...props}
      >
        <main className="mt-16 min-h-[calc(100vh-64px)] p-6">
          {children}
        </main>
      </div>
    );
  }
);

AppShell.displayName = 'AppShell';

export { AppShell };
