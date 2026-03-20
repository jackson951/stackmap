'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { showToast } from '@/lib/utils';
import { User, Repo } from '@/types';
import { useRepos } from '@/hooks/useRepos';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Github, 
  Database, 
  AlertTriangle, 
  Trash2, 
  Shield, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthContext();
  const { repos, fetchRepos } = useRepos();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmInput, setShowConfirmInput] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRepos();
    }
  }, [user, fetchRepos]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('stackmap_token');
      const response = await fetch(`${apiUrl}/api/auth/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        showToast('Account deleted successfully', 'success');
        logout();
        router.push('/');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to delete account', 'error');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      showToast('Network error. Please try again.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = confirmText.toLowerCase() === 'delete my account';

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell user={user} onLogout={logout}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
              <p className="text-gray-400 mt-1">Manage your account and preferences</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="blue" className="text-sm">
                <Shield className="w-3 h-3 mr-1" />
                Secure Account
              </Badge>
              <Badge variant="green" className="text-sm">
                <Github className="w-3 h-3 mr-1" />
                GitHub Connected
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-gray-400">Your basic account information</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="amber" className="text-xs">
                    <UserIcon className="w-3 h-3 mr-1" />
                    User ID: {user.id}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <Avatar
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-20 w-20"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">{user.username}</h3>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="blue" className="text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Email Address</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Github className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-white">GitHub Username</p>
                    <p className="text-sm text-gray-400">{user.username}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Account Statistics</CardTitle>
              <CardDescription className="text-gray-400">Your StackMap usage and repositories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Connected Repositories</p>
                      <p className="text-2xl font-bold text-white">{repos.length}</p>
                    </div>
                    <Database className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Indexed Repositories</p>
                      <p className="text-2xl font-bold text-white">
                        {repos.filter(repo => repo.isIndexed).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-400" />
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Ready for AI</p>
                      <p className="text-2xl font-bold text-white">
                        {repos.filter(repo => repo.isIndexed).length}
                      </p>
                    </div>
                    <EyeOff className="w-8 h-8 text-yellow-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <div>
                  <CardTitle className="text-white">Danger Zone</CardTitle>
                  <CardDescription className="text-gray-400">
                    Permanently delete your account and all associated data
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <h4 className="text-red-400 font-semibold mb-2">⚠️ Important Information</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• All your repositories will be permanently deleted</li>
                    <li>• All file data and AI queries will be removed</li>
                    <li>• This action cannot be undone</li>
                    <li>• You will be logged out immediately</li>
                  </ul>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">This action is irreversible</p>
                    <p className="text-xs text-gray-500">Make sure you understand the consequences</p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Your Account"
          description="This action is permanent and cannot be undone"
        >
          <div className="space-y-6">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-semibold">Before you proceed:</h4>
                  <ul className="text-sm text-gray-300 space-y-1 mt-2">
                    <li>• All repositories and their data will be deleted</li>
                    <li>• All AI queries and responses will be removed</li>
                    <li>• Your GitHub connection will be severed</li>
                    <li>• You will need to create a new account to return</li>
                  </ul>
                </div>
              </div>
            </div>

            {!showConfirmInput ? (
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  If you're sure about this decision, click the button below to proceed.
                </p>
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowConfirmInput(true)}
                    className="flex-1"
                  >
                    I Understand, Continue
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type "delete my account" to confirm
                  </label>
                  <input
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Type 'delete my account' to confirm"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowConfirmInput(false);
                      setConfirmText('');
                    }}
                    className="flex-1"
                  >
                    Go Back
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    disabled={!canDelete || isDeleting}
                    loading={isDeleting}
                    className="flex-1"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete My Account'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </AppShell>
  );
}
