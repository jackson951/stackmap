'use client';

import { useState } from 'react';
import { File, Folder, FileText, Code, GitBranch, Users, Database, Settings, Terminal, Cpu, Globe, DatabaseZap, Shield, Zap, Brain, Sparkles } from 'lucide-react';
import { RepoFile } from '@/types';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  files: RepoFile[];
  selectedPath?: string;
  onSelectFile?: (file: RepoFile) => void;
}

interface TreeNode {
  name: string;
  path: string;
  isFile: boolean;
  children?: TreeNode[];
  file?: RepoFile;
  type?: 'core' | 'feature' | 'config' | 'test' | 'docs' | 'utility' | 'api' | 'database' | 'frontend' | 'backend' | 'infrastructure' | 'security' | 'monitoring' | 'ai' | 'unknown';
  importance?: 'critical' | 'high' | 'medium' | 'low';
  lastModified?: string;
  contributors?: string[];
  description?: string;
}

const FileTree = ({ files, selectedPath, onSelectFile }: FileTreeProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'type' | 'importance' | 'modified'>('type');

  const classifyFile = (path: string, file?: RepoFile): { type: TreeNode['type'], importance: TreeNode['importance'], description: string } => {
    const pathLower = path.toLowerCase();
    const nameLower = file?.name?.toLowerCase() || '';
    
    // Core system files
    if (pathLower.includes('src/core') || pathLower.includes('src/system') || pathLower.includes('src/engine')) {
      return { type: 'core', importance: 'critical', description: 'Core system engine and infrastructure' };
    }
    
    // Configuration files
    if (pathLower.includes('config') || pathLower.includes('settings') || pathLower.includes('env') || 
        nameLower.includes('config') || nameLower.includes('settings') || nameLower.includes('env')) {
      return { type: 'config', importance: 'high', description: 'System configuration and environment settings' };
    }
    
    // Database files
    if (pathLower.includes('db') || pathLower.includes('database') || pathLower.includes('schema') || 
        nameLower.includes('db') || nameLower.includes('database') || nameLower.includes('schema')) {
      return { type: 'database', importance: 'high', description: 'Database schema and management' };
    }
    
    // API endpoints
    if (pathLower.includes('api') || pathLower.includes('endpoint') || pathLower.includes('route')) {
      return { type: 'api', importance: 'high', description: 'API endpoints and routing' };
    }
    
    // Frontend/UI
    if (pathLower.includes('ui') || pathLower.includes('frontend') || pathLower.includes('web') || 
        pathLower.includes('components') || pathLower.includes('pages')) {
      return { type: 'frontend', importance: 'medium', description: 'User interface and frontend components' };
    }
    
    // Backend/Server
    if (pathLower.includes('server') || pathLower.includes('backend') || pathLower.includes('service')) {
      return { type: 'backend', importance: 'high', description: 'Backend services and server logic' };
    }
    
    // AI/ML components
    if (pathLower.includes('ai') || pathLower.includes('ml') || pathLower.includes('model') || 
        nameLower.includes('ai') || nameLower.includes('ml') || nameLower.includes('model')) {
      return { type: 'ai', importance: 'medium', description: 'Artificial intelligence and machine learning' };
    }
    
    // Security
    if (pathLower.includes('auth') || pathLower.includes('security') || pathLower.includes('auth') || 
        nameLower.includes('auth') || nameLower.includes('security') || nameLower.includes('auth')) {
      return { type: 'security', importance: 'critical', description: 'Authentication and security systems' };
    }
    
    // Infrastructure/DevOps
    if (pathLower.includes('infra') || pathLower.includes('deploy') || pathLower.includes('docker') || 
        pathLower.includes('k8s') || pathLower.includes('terraform')) {
      return { type: 'infrastructure', importance: 'high', description: 'Infrastructure and deployment' };
    }
    
    // Monitoring/Observability
    if (pathLower.includes('monitor') || pathLower.includes('log') || pathLower.includes('metrics') || 
        nameLower.includes('monitor') || nameLower.includes('log') || nameLower.includes('metrics')) {
      return { type: 'monitoring', importance: 'medium', description: 'System monitoring and observability' };
    }
    
    // Tests
    if (pathLower.includes('test') || pathLower.includes('spec') || nameLower.includes('test') || nameLower.includes('spec')) {
      return { type: 'test', importance: 'medium', description: 'Test suites and specifications' };
    }
    
    // Documentation
    if (pathLower.includes('doc') || nameLower.includes('readme') || nameLower.includes('doc')) {
      return { type: 'docs', importance: 'low', description: 'Documentation and guides' };
    }
    
    // Features
    if (pathLower.includes('feature') || pathLower.includes('module') || pathLower.includes('plugin')) {
      return { type: 'feature', importance: 'medium', description: 'Feature modules and plugins' };
    }
    
    // Utilities
    if (pathLower.includes('util') || pathLower.includes('helper') || pathLower.includes('lib')) {
      return { type: 'utility', importance: 'medium', description: 'Utility functions and helpers' };
    }
    
    return { type: 'unknown', importance: 'low', description: 'Unknown file type' };
  };

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
          const classification = classifyFile(currentPath, isFile ? file : undefined);
          tree[currentPath] = {
            name: part,
            path: currentPath,
            isFile,
            file: isFile ? file : undefined,
            children: isFile ? undefined : [],
            type: classification.type,
            importance: classification.importance,
            description: classification.description,
            lastModified: file?.lastModified || new Date().toISOString(),
            contributors: file?.contributors || ['Unknown'],
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

  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return [...nodes].sort((a, b) => {
      switch (sortBy) {
        case 'type':
          const typeOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          const aPriority = typeOrder[a.importance || 'low'];
          const bPriority = typeOrder[b.importance || 'low'];
          if (aPriority !== bPriority) return aPriority - bPriority;
          return a.type?.localeCompare(b.type || '') || 0;
        case 'importance':
          const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          const aImp = importanceOrder[a.importance || 'low'];
          const bImp = importanceOrder[b.importance || 'low'];
          return aImp - bImp;
        case 'modified':
          return new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });
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

  const handleFileSelection = (file?: RepoFile) => {
    if (file && onSelectFile) {
      onSelectFile(file);
    }
  };

  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedFolders.has(node.path);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = node.file?.path === selectedPath;
    
    const getTypeIcon = (type: TreeNode['type'], isFile: boolean) => {
      if (isFile) {
        switch (type) {
          case 'core': return <Cpu className="w-4 h-4 text-red-400" />;
          case 'api': return <Globe className="w-4 h-4 text-blue-400" />;
          case 'database': return <Database className="w-4 h-4 text-green-400" />;
          case 'frontend': return <Code className="w-4 h-4 text-purple-400" />;
          case 'backend': return <Terminal className="w-4 h-4 text-orange-400" />;
          case 'ai': return <Brain className="w-4 h-4 text-pink-400" />;
          case 'security': return <Shield className="w-4 h-4 text-yellow-400" />;
          case 'config': return <Settings className="w-4 h-4 text-gray-400" />;
          case 'test': return <Zap className="w-4 h-4 text-green-300" />;
          case 'docs': return <FileText className="w-4 h-4 text-gray-300" />;
          default: return <File className="w-4 h-4 text-gray-400" />;
        }
      } else {
        switch (type) {
          case 'core': return <DatabaseZap className="w-4 h-4 text-red-400" />;
          case 'api': return <GitBranch className="w-4 h-4 text-blue-400" />;
          case 'database': return <DatabaseZap className="w-4 h-4 text-green-400" />;
          case 'frontend': return <Users className="w-4 h-4 text-purple-400" />;
          case 'backend': return <Terminal className="w-4 h-4 text-orange-400" />;
          case 'ai': return <Sparkles className="w-4 h-4 text-pink-400" />;
          case 'security': return <Shield className="w-4 h-4 text-yellow-400" />;
          case 'config': return <Settings className="w-4 h-4 text-gray-400" />;
          case 'test': return <Zap className="w-4 h-4 text-green-300" />;
          case 'docs': return <FileText className="w-4 h-4 text-gray-300" />;
          default: return <Folder className="w-4 h-4 text-gray-400" />;
        }
      }
    };

    const getImportanceColor = (importance: TreeNode['importance']) => {
      switch (importance) {
        case 'critical': return 'border-red-500 bg-red-900/20';
        case 'high': return 'border-orange-500 bg-orange-900/20';
        case 'medium': return 'border-blue-500 bg-blue-900/20';
        case 'low': return 'border-gray-500 bg-gray-900/20';
        default: return 'border-gray-600 bg-gray-800/50';
      }
    };

    return (
      <div key={node.path} className="ml-4">
        <div
          onClick={() => node.file && handleFileSelection(node.file)}
          role={node.file ? 'button' : undefined}
          tabIndex={node.file ? 0 : -1}
          className={cn(
            'flex items-center py-2 px-3 rounded-lg border-2 transition-all duration-200',
            getImportanceColor(node.importance),
            node.file ? 'cursor-pointer hover:border-indigo-400/50' : '',
            isSelected && 'border-indigo-500 bg-indigo-950/50 shadow-lg shadow-indigo-900/40',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
          )}
        >
          {hasChildren ? (
            <button
              onClick={() => toggleFolder(node.path)}
              className="mr-3 text-gray-400 hover:text-white transition-colors"
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
            <div className="w-8 mr-3" />
          )}
          
          <div className="flex-shrink-0 mr-3">
            {getTypeIcon(node.type, node.isFile)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-200 truncate">{node.name}</span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-semibold text-white ${
                node.importance === 'critical' ? 'bg-red-600' :
                node.importance === 'high' ? 'bg-orange-600' :
                node.importance === 'medium' ? 'bg-blue-600' :
                'bg-gray-600'
              }`}>
                {node.importance?.toUpperCase()}
              </span>
              {node.type && (
                <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                  {node.type}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
              {node.description && (
                <span className="italic">"{node.description}"</span>
              )}
              {node.lastModified && (
                <span>Modified: {new Date(node.lastModified).toLocaleDateString()}</span>
              )}
              {node.contributors && node.contributors.length > 0 && (
                <span>Contributors: {node.contributors.join(', ')}</span>
              )}
            </div>
          </div>
          
          {node.file && node.file.summary && (
            <div className="ml-4 text-xs text-gray-500 italic max-w-xs">
              {node.file.summary}
            </div>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-2 border-l-2 border-gray-700 pl-4">
            {sortNodes(node.children!).map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree(files);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-200">Repository Structure</h3>
        <div className="flex space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="type">Sort by Type</option>
            <option value="importance">Sort by Importance</option>
            <option value="modified">Sort by Modified</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        {sortNodes(tree).map(node => renderNode(node))}
      </div>
    </div>
  );
};

export { FileTree };
