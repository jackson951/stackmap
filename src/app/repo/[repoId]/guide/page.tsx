'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { guideApi } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { showToast } from '@/lib/utils';
import { OnboardingGuide } from '@/components/guide/OnboardingGuide';
import { FileText, Scroll, RefreshCw, Download } from 'lucide-react';

export default function GuidePage() {
  const router = useRouter();
  const params = useParams();
  const repoId = params.repoId as string;
  const { user, logout } = useAuth();
  
  const [guide, setGuide] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    // Check if we have a cached guide or need to generate one
    const cachedGuide = localStorage.getItem(`guide_${repoId}`);
    if (cachedGuide) {
      setGuide(cachedGuide);
    }
  }, [repoId]);

  const handleGenerateGuide = async () => {
    setGenerating(true);
    setLoading(true);
    setGuide('');
    
    try {
      const result = await guideApi.generateGuide(repoId);
      setGuide(result.guide);
      localStorage.setItem(`guide_${repoId}`, result.guide);
      showToast('Onboarding guide generated successfully', 'success');
    } catch (error) {
      console.error('Failed to generate guide:', error);
      showToast('Failed to generate guide', 'error');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleRegenerateGuide = () => {
    // Clear cached guide and regenerate
    localStorage.removeItem(`guide_${repoId}`);
    setGuide('');
    handleGenerateGuide();
  };

  const handleDownloadGuide = () => {
    if (!guide) return;
    
    const blob = new Blob([guide], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'onboarding-guide.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Guide downloaded successfully', 'success');
  };

  const handleViewFiles = () => {
    router.push(`/repo/${repoId}/files`);
  };

  const handleAskAI = () => {
    router.push(`/repo/${repoId}/query`);
  };

  return (
    <AppShell user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-400">
            <span className="hover:text-white cursor-pointer" onClick={() => router.push('/dashboard')}>
              Dashboard
            </span>
            <span className="mx-2">/</span>
            <span className="hover:text-white cursor-pointer" onClick={() => router.push(`/repo/${repoId}`)}>
              Repository
            </span>
            <span className="mx-2">/</span>
            <span className="text-white font-medium">Onboarding Guide</span>
          </nav>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Onboarding Guide</h1>
              <p className="text-gray-400 mt-1">AI-generated documentation for new developers</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleViewFiles}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Explore Files</span>
              </Button>
              <Button
                onClick={handleAskAI}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <Scroll className="w-4 h-4" />
                <span>Ask AI</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Guide Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Project Documentation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !guide ? (
              <div className="text-center py-12">
                <div className="flex justify-center mb-4">
                  <Spinner size="lg" />
                </div>
                <p className="text-gray-400">Analyzing your codebase...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment for large repositories</p>
              </div>
            ) : guide ? (
              <OnboardingGuide
                guide={guide}
                onRegenerate={handleRegenerateGuide}
                loading={generating}
              />
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Generate Onboarding Guide</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    Claude will analyze your codebase and create a comprehensive guide 
                    for new developers joining your project.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <Button
                    onClick={handleGenerateGuide}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700"
                  >
                    <Scroll className="w-5 h-5 mr-2" />
                    Generate Guide
                  </Button>
                  
                  <div className="text-sm text-gray-500">
                    <p>What you'll get:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-left max-w-md mx-auto">
                      <li>Project architecture overview</li>
                      <li>Key files and directories explained</li>
                      <li>Setup and configuration instructions</li>
                      <li>Development workflow guidelines</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}