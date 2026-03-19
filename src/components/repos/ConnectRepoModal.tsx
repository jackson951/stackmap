'use client';

import * as React from 'react';
import { useRepos } from '@/hooks/useRepos';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/hooks/useToast';
import { Plus } from 'lucide-react';

interface ConnectRepoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

const ConnectRepoModal = ({ isOpen, onClose, onConnect }: ConnectRepoModalProps) => {
  const [fullName, setFullName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const { connectRepo } = useRepos();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setLoading(true);
    try {
      await connectRepo(fullName.trim());
      showToast('Repository connected successfully', 'success');
      setFullName('');
      onClose();
      onConnect();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to connect repository', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Connect Repository</h2>
            <p className="text-gray-400 text-sm">Connect a GitHub repository to start exploring</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="owner/repository-name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!fullName.trim()}
            >
              Connect Repository
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export { ConnectRepoModal };