'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { AppShell } from '@/components/layout/AppShell';
import { useAuthContext } from '@/contexts/AuthContext';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const { user } = useAuthContext();

  const handleGoHome = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <AppShell user={user} onLogout={() => {}}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full border border-red-500/30">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>

          {/* Error Content */}
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white tracking-tight">
              404
            </h1>
            <h2 className="text-2xl font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved. 
              Don't worry, it happens to the best of us.
            </p>
          </div>

          {/* Error Details */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-left">
            <h3 className="text-sm font-semibold text-gray-300 mb-2">What happened?</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• The URL might be misspelled</li>
              <li>• The page may have been moved or deleted</li>
              <li>• You might not have permission to access this page</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGoHome}
                className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-medium"
              >
                <Home className="w-4 h-4" />
                <span>{user ? 'Go to Dashboard' : 'Go Home'}</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleGoBack}
                className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-white/10 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Go Back</span>
              </Button>
            </div>

            {/* Additional Help */}
            <div className="text-xs text-gray-500">
              If you believe this is an error, please contact support or try refreshing the page.
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="grid grid-cols-3 gap-2 opacity-50">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"></div>
            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full"></div>
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}