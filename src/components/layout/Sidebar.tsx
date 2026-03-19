'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  GitBranch,
  LogOut,
  Map,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSidebarToggle?: (isOpen: boolean) => void;
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, onSidebarToggle, ...props }, ref) => {
    const router = useRouter();
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    const navigationItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ];

    const isActive = (href: string) => pathname === href;

    const handleToggle = () => {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      onSidebarToggle?.(newIsOpen);
    };

    const handleNavigate = (href: string) => {
      router.push(href);
      setIsOpen(false);
      onSidebarToggle?.(false);
    };

    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={handleToggle}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg border border-gray-700 text-white hover:bg-gray-700 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar */}
        <div
          ref={ref}
          className={cn(
            'fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-700 bg-gray-900',
            'transition-transform duration-300 ease-in-out',
            'transform lg:translate-x-0',
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
            className
          )}
          {...props}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
            <div className="flex items-center space-x-3">
              <img src="/stackmap.svg" alt="StackMap" className="h-6 w-6 text-indigo-400" />
              <span className="text-xl font-bold text-white">StackMap</span>
            </div>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.name}
                  variant={isActive(item.href) ? 'primary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive(item.href) && 'bg-indigo-600/20 border border-indigo-500/30'
                  )}
                  onClick={() => handleNavigate(item.href)}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white"
              onClick={() => {
                logout();
                setIsOpen(false);
                onSidebarToggle?.(false);
              }}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => {
              setIsOpen(false);
              onSidebarToggle?.(false);
            }}
          />
        )}
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export { Sidebar };
