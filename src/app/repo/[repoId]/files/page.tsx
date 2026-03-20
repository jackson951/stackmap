'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { indexingApi, filesApi } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { DynamicBreadcrumb } from '@/components/layout/Breadcrumb';
import { FileTree } from '@/components/files/FileTree';
import { ChurnHeatmap } from '@/components/files/ChurnHeatmap';
import { FileContentPanel } from '@/components/files/FileContentPanel';
import { RepoFile, RepoFileContent } from '@/types';
import { formatFileSize, showToast } from '@/lib/utils';
import { Database, FileText, RefreshCw, Sparkles, MessageSquare } from 'lucide-react';

export default function FileExplorerPage() {
  const router = useRouter();
  const params = useParams();
  const repoId = params.repoId as string;
  const { user, logout } = useAuth();

  const [files, setFiles] = useState<RepoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [indexing, setIndexing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<RepoFile | null>(null);
  const [fileContent, setFileContent] = useState<RepoFileContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [unsupportedContent, setUnsupportedContent] = useState<string | null>(null);
  const selectedFileRef = useRef<RepoFile | null>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      const filesData = await indexingApi.getRepoFiles(repoId);
      setFiles(filesData);
    } catch (error) {
      console.error('Failed to load files:', error);
      showToast('Failed to load repository files', 'error');
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  const textFriendlyExtensions = useMemo(() => new Set([
    'js','ts','tsx','jsx','json','md','txt','py','rb','go','rs','java','c','cpp','cs','html','css','scss','yaml','yml','ini','sh','bash','dockerfile'
  ]), []);

  const selectFile = useCallback(async (file: RepoFile) => {
    selectedFileRef.current = file;
    setSelectedFile(file);
    setLoadingContent(true);
    setFileContent(null);
    setUnsupportedContent(null);

    const ext = file.extension?.toLowerCase();
    if (ext && !textFriendlyExtensions.has(ext)) {
      setUnsupportedContent(`Display not supported for .${ext} files. Download to view.`);
      setLoadingContent(false);
      return;
    }
    try {
      const content = await filesApi.getRepoFileContent(repoId, file.path);
      setFileContent(content);
    } catch (error) {
      console.error('Failed to load file content:', error);
      showToast('Unable to load file content', 'error');
    } finally {
      setLoadingContent(false);
    }
  }, [repoId]);

  const loadDefaultSelection = useCallback(() => {
    if (files.length === 0) {
      setSelectedFile(null);
      setFileContent(null);
      return;
    }

    const currentPath = selectedFileRef.current?.path;
    const stillPresent = currentPath && files.some(file => file.path === currentPath);
    if (!stillPresent) {
      void selectFile(files[0]);
    }
  }, [files, selectFile]);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  useEffect(() => {
    loadDefaultSelection();
  }, [files, loadDefaultSelection]);

  const handleIndexRepo = async () => {
    setIndexing(true);
    try {
      await indexingApi.indexRepo(repoId);
      showToast('Repository re-indexed successfully', 'success');
      await loadFiles();
    } catch (error) {
      console.error('Failed to index repository:', error);
      showToast('Failed to re-index repository', 'error');
    } finally {
      setIndexing(false);
    }
  };

  const handleViewQuery = () => {
    router.push(`/repo/${repoId}/query`);
  };

  const handleViewGuide = () => {
    router.push(`/repo/${repoId}/guide`);
  };

  const heroStats = useMemo(() => {
    const totalCommits = files.reduce((sum, file) => sum + (file.commitCount || 0), 0);
    const totalBytes = files.reduce((sum, file) => sum + (file.size || 0), 0);
    const extensions = new Set<string>();
    files.forEach(file => {
      if (file.extension) {
        extensions.add(file.extension.toLowerCase());
      }
    });
    const hottestFile = files.reduce<RepoFile | null>((prev, curr) => {
      if (!prev) return curr;
      return (curr.commitCount || 0) > (prev.commitCount || 0) ? curr : prev;
    }, null);

    return {
      totalFiles: files.length,
      totalCommits,
      totalBytes,
      extensionCount: extensions.size,
      hottestFileName: hottestFile?.name,
    };
  }, [files]);

  if (loading && files.length === 0) {
    return (
      <AppShell user={user} onLogout={logout}>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <DynamicBreadcrumb currentPath="/repo/[repoId]/files" />

        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 to-slate-900/30 p-6 space-y-6 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.6em] text-indigo-400">Repository Intelligence</p>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white">File Explorer</h1>
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <p className="text-gray-400 mt-1">
                Explore a living map of the repository, surface high-impact files, and pull the exact contents you need.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleIndexRepo}
                variant="primary"
                loading={indexing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${indexing ? 'animate-spin' : ''}`} />
                <span>{indexing ? 'Indexing' : 'Re-index repository'}</span>
              </Button>
              <Button
                onClick={handleViewQuery}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask AI</span>
              </Button>
              <Button
                onClick={handleViewGuide}
                variant="ghost"
                className="flex items-center space-x-2 text-white border border-white/10 bg-white/5"
              >
                <FileText className="w-4 h-4" />
                <span>Guide</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Files tracked</p>
              <p className="text-2xl font-semibold text-white">{heroStats.totalFiles}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Commits</p>
              <p className="text-2xl font-semibold text-white">{heroStats.totalCommits}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Indexed size</p>
              <p className="text-2xl font-semibold text-white">{formatFileSize(heroStats.totalBytes)}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">File types</p>
              <p className="text-2xl font-semibold text-white">{heroStats.extensionCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <Database className="w-4 h-4 text-emerald-300" />
            <span>
              Most active file: <span className="text-white font-medium">{heroStats.hottestFileName || 'N/A'}</span>
            </span>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <Card className="border-white/10 bg-gradient-to-br from-neutral-900 to-slate-950 shadow-2xl shadow-black/40">
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <Database className="w-5 h-5 text-indigo-300" />
                  Repository Tree
                </CardTitle>
                <p className="text-sm text-gray-400">Navigate by importance, type, and contributor insights.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[520px] overflow-y-auto pr-1">
                  <FileTree
                    files={files}
                    selectedPath={selectedFile?.path}
                    onSelectFile={selectFile}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  Churn Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChurnHeatmap files={files} />
              </CardContent>
            </Card>
          </div>

          <Card className="border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-900/20 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white text-xl">
                <FileText className="w-5 h-5 text-cyan-300" />
                File Content
              </CardTitle>
              <p className="text-sm text-gray-400">
                Cached text, metadata, and summaries. We refresh automatically if the file isn’t yet cached.
              </p>
            </CardHeader>
            <CardContent className="flex-1">
              <FileContentPanel
                selectedFile={selectedFile || undefined}
                fileContent={fileContent || undefined}
                loadingContent={loadingContent}
                unsupportedMessage={unsupportedContent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
