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
import { Breadcrumb } from './Breadcrumb';
import { Menu, X, Home, Database, MessageSquare, LogOut } from 'lucide-react';

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const isDashboard = pathname === '/dashboard';
    const isRepoPage = pathname.startsWith('/repo/');
    const isRepoFiles = pathname.match(/^\/repo\/[^/]+\/files$/);
    const isRepoQuery = pathname.match(/^\/repo\/[^/]+\/query$/);
    const isRepoGuide = pathname.match(/^\/repo\/[^/]+\/guide$/);
    const isRepoDetails = pathname.match(/^\/repo\/[^/]+$/) && !pathname.endsWith('/files') && !pathname.endsWith('/query') && !pathname.endsWith('/guide');

    // Extract repo ID for navigation
    const repoMatch = pathname.match(/^\/repo\/([^/]+)/);
    const repoId = repoMatch ? repoMatch[1] : null;

    const navigateToRepoSection = (section: string) => {
      if (repoId) {
        router.push(`/repo/${repoId}/${section}`);
      }
    };

    const navigateToRepo = () => {
      if (repoId) {
        router.push(`/repo/${repoId}`);
      }
    };

    return (
      <header
        ref={ref}
        className={cn(
          'fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl',
          'transition-all duration-300 ease-in-out',
          'shadow-lg shadow-black/20',
          className
        )}
        {...props}
      >
        <div className="flex h-full items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <img src="/stackmap.svg" alt="StackMap" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  {title || (isDashboard ? 'Dashboard' : isRepoPage ? 'Repository' : 'StackMap')}
                </h1>
                <p className="text-xs text-gray-400">AI Codebase Intelligence</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => router.push('/dashboard')}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              {isRepoPage && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-gray-300 hover:text-white hover:bg-white/10 ${isRepoFiles ? 'bg-white/10 text-white' : ''}`}
                    onClick={() => navigateToRepoSection('files')}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Files
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-gray-300 hover:text-white hover:bg-white/10 ${isRepoQuery ? 'bg-white/10 text-white' : ''}`}
                    onClick={() => navigateToRepoSection('query')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-gray-300 hover:text-white hover:bg-white/10 ${isRepoGuide ? 'bg-white/10 text-white' : ''}`}
                    onClick={() => navigateToRepoSection('guide')}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Guide
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`text-gray-300 hover:text-white hover:bg-white/10 ${isRepoDetails ? 'bg-white/10 text-white' : ''}`}
                    onClick={navigateToRepo}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </>
              )}
            </div>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative group">
                  <div className="relative">
                    <Avatar
                      src={currentUser?.avatarUrl}
                      alt={currentUser?.username}
                      className="h-10 w-10 mr-3"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white group-hover:scale-110 transition-transform duration-200"></div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{currentUser?.username}</div>
                    <div className="text-xs text-gray-400">Developer</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-gray-800 border border-white/10">
                <DropdownMenuItem 
                  onClick={() => router.push('/profile')}
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
                      <img src="/stackmap.svg" alt="StackMap" className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Profile Settings</div>
                      <div className="text-xs text-gray-400">Manage your account</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
                      <Database className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Connected Repos</div>
                      <div className="text-xs text-gray-400">Manage repositories</div>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <LogOut className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Sign Out</div>
                      <div className="text-xs text-red-300">End your session</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div 
          className={cn(
            'lg:hidden fixed top-16 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 transform transition-transform duration-300 ease-in-out',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="px-6 py-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => {
                router.push('/dashboard');
                setIsMobileMenuOpen(false);
              }}
            >
              <Home className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
            
            {isRepoPage && (
              <>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 ${isRepoFiles ? 'bg-white/10 text-white' : ''}`}
                  onClick={() => {
                    navigateToRepoSection('files');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Database className="w-4 h-4 mr-3" />
                  Files
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 ${isRepoQuery ? 'bg-white/10 text-white' : ''}`}
                  onClick={() => {
                    navigateToRepoSection('query');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-3" />
                  Ask AI
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 ${isRepoGuide ? 'bg-white/10 text-white' : ''}`}
                  onClick={() => {
                    navigateToRepoSection('guide');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Database className="w-4 h-4 mr-3" />
                  Guide
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-white/10 ${isRepoDetails ? 'bg-white/10 text-white' : ''}`}
                  onClick={() => {
                    navigateToRepo();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Database className="w-4 h-4 mr-3" />
                  Details
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

export { Header };
