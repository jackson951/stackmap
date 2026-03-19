'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar } from '@/components/ui/Avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { User } from '@/types';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  user?: User | null;
  onLogout?: () => void;
}

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, title, user, onLogout, ...props }, ref) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user: authUser, logout: authLogout } = useAuth();

    const currentUser = user || authUser;
    const handleLogout = onLogout || authLogout;

    const isDashboard = pathname === '/dashboard';
    const isRepoPage = pathname.startsWith('/repo/');

    return (
      <header
        ref={ref}
        className={cn(
          'fixed top-0 left-64 right-0 z-30 h-16 border-b border-gray-700 bg-gray-800/50 backdrop-blur-md',
          'transition-all duration-300 ease-in-out',
          className
        )}
        {...props}
      >
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-white">
              {title || (isDashboard ? 'Dashboard' : isRepoPage ? 'Repository' : 'StackMap')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
           
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <Avatar
                    src={currentUser?.avatarUrl}
                    alt={currentUser?.username}
                    className="h-8 w-8 mr-2"
                  />
                  <span className="text-sm font-medium text-white">{currentUser?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export { Header };