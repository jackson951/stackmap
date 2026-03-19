'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User } from '@/types';

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  user?: User | null;
  onLogout?: () => void;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, children, user, onLogout, ...props }, ref) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    // Detect mobile devices
    React.useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 1024); // lg breakpoint
      };
      
      checkIsMobile();
      window.addEventListener('resize', checkIsMobile);
      
      return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Calculate main content margin
    const getMainMargin = () => {
      if (!isMobile) {
        return 'lg:ml-64'; // Always show sidebar on desktop
      }
      return sidebarOpen ? 'ml-64' : 'ml-0'; // Hide/show sidebar on mobile
    };

    return (
      <div
        ref={ref}
        className={cn('min-h-screen bg-gray-900', className)}
        {...props}
      >
        <Sidebar onSidebarToggle={setSidebarOpen} />
        <Header user={user} onLogout={onLogout} />
        
        <main className={`${getMainMargin()} mt-16 min-h-[calc(100vh-64px)] p-6 transition-all duration-300 ease-in-out`}>
          {children}
        </main>
      </div>
    );
  }
);

AppShell.displayName = 'AppShell';

export { AppShell };
