'use client';

import Link from 'next/link';
import { Github, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface PublicShellProps {
  children: React.ReactNode;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];

const PublicShell = ({ children }: PublicShellProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="bg-gradient-to-br from-gray-900/90 via-gray-900/60 to-black/90 border-b border-white/10 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              <img src="/stackmap.svg" alt="StackMap" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                StackMap
              </p>
              <p className="text-xs text-gray-400">AI Codebase Intelligence</p>
            </div>
          </Link>
          <nav className="flex flex-wrap gap-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            variant="ghost"
            className="border border-white/20 bg-white/5 text-white flex items-center space-x-2"
            onClick={() => window.open('https://github.com/login/oauth/authorize', '_blank')}
          >
            <Github className="w-4 h-4" />
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 text-gray-300" />
          </Button>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export { PublicShell };
