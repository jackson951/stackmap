'use client';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { formatFileSize, showToast } from '@/lib/utils';
import { RepoFile, RepoFileContent } from '@/types';
import { ClipboardCopy, FileText, Sparkles } from 'lucide-react';

interface FileContentPanelProps {
  selectedFile?: RepoFile;
  fileContent?: RepoFileContent;
  loadingContent?: boolean;
  unsupportedMessage?: string | null;
}

const FileContentPanel = ({ selectedFile, fileContent, loadingContent, unsupportedMessage }: FileContentPanelProps) => {
  if (!selectedFile) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[320px] rounded-2xl border border-dashed border-white/10 bg-gray-900/40 p-6 text-center space-y-3">
        <FileText className="w-6 h-6 text-indigo-400" />
        <p className="text-lg font-semibold text-white">Select a file to inspect</p>
        <p className="text-sm text-gray-400">
          The tree on the left is a dynamic navigator, and selecting any file will fetch the latest cached content.
        </p>
      </div>
    );
  }

  const sizeLabel = selectedFile.size ? formatFileSize(selectedFile.size) : 'Size unknown';
  const summaryText = fileContent?.summary || selectedFile.summary || 'No summary available yet.';

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(selectedFile.path);
      showToast('File path copied', 'success');
    } catch (error) {
      showToast('Unable to copy file path', 'error');
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[420px] space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">File</p>
          <h2 className="text-2xl font-bold text-white">{selectedFile.name}</h2>
          <p className="text-sm text-gray-400 truncate">{selectedFile.path}</p>
        </div>
        <Button variant="ghost" onClick={handleCopyPath} size="sm" className="border border-white/20 bg-white/5 text-xs font-semibold text-white">
          <ClipboardCopy className="w-4 h-4 mr-2" />
          Copy path
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Badge variant="blue">{selectedFile.extension?.toUpperCase() || 'Unknown extension'}</Badge>
        <Badge variant="purple">{sizeLabel}</Badge>
        <Badge variant="green">{selectedFile.commitCount ? `${selectedFile.commitCount} commits` : 'Commits unknown'}</Badge>
        <Badge variant="amber">{selectedFile.contributors?.length ? `${selectedFile.contributors.length} contributors` : 'Contributors unknown'}</Badge>
      </div>

      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/0 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-gray-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Summary</span>
          </div>
          <Badge variant="muted">{fileContent ? 'Fresh' : 'Cached'}</Badge>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{summaryText}</p>
      </div>

      <div className="flex-1 flex flex-col rounded-2xl border border-white/10 bg-black/50 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-700 via-purple-700 to-cyan-500">
          <div className="flex items-center space-x-2 text-white">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-semibold">Content</span>
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-gray-200">
            {fileContent?.content ? `${fileContent.content.split('\n').length} lines` : 'Pending'}
          </span>
        </div>
        <div className="flex-1 relative">
          {loadingContent ? (
            <div className="flex h-full items-center justify-center">
              <Spinner />
            </div>
          ) : unsupportedMessage ? (
            <div className="flex h-full items-center justify-center px-6 text-sm text-gray-300 text-center">
              {unsupportedMessage}
            </div>
          ) : (
            <pre className="h-full max-h-full overflow-auto whitespace-pre-wrap break-words px-5 py-6 text-xs leading-relaxed text-gray-100 bg-black/40">
              {fileContent?.content || 'No content available yet.'}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};

export { FileContentPanel };
