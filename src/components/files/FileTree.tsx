'use client';

import { useState } from 'react';
import { File, Folder, FileText, Code } from 'lucide-react';
import { RepoFile } from '@/types';
import { getFileIcon } from '@/lib/utils';

interface FileTreeProps {
  files: RepoFile[];
}

interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  children?: TreeNode[];
  file?: RepoFile;
}

const FileTree = ({ files }: FileTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const buildTree = (files: RepoFile[]): TreeNode[] => {
    const tree: Record<string, TreeNode> = {};
    
    // Create all nodes
    files.forEach(file => {
      const parts = file.path.split('/');
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!tree[currentPath]) {
          tree[currentPath] = {
            name: part,
            path: currentPath,
            isFile,
            file: isFile ? file : undefined,
            children: isFile ? undefined : [],
          };
        }
      });
    });

    // Build hierarchy
    const result: TreeNode[] = [];
    Object.values(tree).forEach(node => {
      if (node.path.includes('/')) {
        const parentPath = node.path.split('/').slice(0, -1).join('/');
        if (tree[parentPath]) {
          tree[parentPath].children = tree[parentPath].children || [];
          tree[parentPath].children!.push(node);
        }
      } else {
        result.push(node);
      }
    });

    return result;
  };

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedFolders.has(node.path);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.path} className="ml-4">
        <div className="flex items-center py-1 hover:bg-gray-700 rounded px-2">
          {hasChildren ? (
            <button
              onClick={() => toggleFolder(node.path)}
              className="mr-2 text-gray-400 hover:text-white"
            >
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="w-6 mr-2" />
          )}
          
          {node.isFile ? (
            <File className="w-4 h-4 text-gray-400 mr-2" />
          ) : (
            <Folder className={`w-4 h-4 mr-2 ${isExpanded ? 'text-indigo-400' : 'text-gray-400'}`} />
          )}
          
          <span className="text-sm text-gray-300">{node.name}</span>
          
          {node.file && node.file.summary && (
            <span className="ml-2 text-xs text-gray-500 italic">• {node.file.summary}</span>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(files);

  return (
    <div className="space-y-2">
      {tree.map(node => renderNode(node))}
    </div>
  );
};

export { FileTree };
