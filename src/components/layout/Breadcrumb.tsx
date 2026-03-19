import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useRepos } from '@/hooks/useRepos';
import { Spinner } from '@/components/ui/Spinner';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-400">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <span 
              className="hover:text-white cursor-pointer"
              onClick={() => window.location.href = item.href!}
            >
              {item.label}
            </span>
          ) : (
            <span className={item.isCurrent ? 'text-white font-medium' : 'text-gray-400'}>
              {item.label}
            </span>
          )}
          {index < items.length - 1 && <span className="mx-2">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}

interface DynamicBreadcrumbProps {
  currentPath: string;
}

export function DynamicBreadcrumb({ currentPath }: DynamicBreadcrumbProps) {
  const router = useRouter();
  const params = useParams();
  const { repos, loading: reposLoading } = useRepos();
  
  const repoId = params.repoId as string;
  const repo = repos?.find(r => r.id === repoId);

  // Generate breadcrumb items based on current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      {
        label: 'Dashboard',
        href: '/dashboard'
      }
    ];

    if (currentPath.startsWith('/repo/')) {
      if (!repoId) return items;

      if (reposLoading) {
        items.push({
          label: 'Loading...',
          href: `/repo/${repoId}`
        });
      } else if (repo) {
        items.push({
          label: repo.name,
          href: `/repo/${repoId}`
        });
      } else {
        items.push({
          label: 'Repository',
          href: `/repo/${repoId}`
        });
      }

      // Add specific page items
      if (currentPath.includes('/files')) {
        items.push({
          label: 'Files',
          isCurrent: true
        });
      } else if (currentPath.includes('/guide')) {
        items.push({
          label: 'Onboarding Guide',
          isCurrent: true
        });
      } else if (currentPath.includes('/query')) {
        items.push({
          label: 'Ask AI',
          isCurrent: true
        });
      } else {
        items.push({
          label: 'Repository',
          isCurrent: true
        });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="mb-6">
      {reposLoading && breadcrumbItems.length > 1 && (
        <div className="flex items-center space-x-2">
          <Spinner size="sm" />
          <span className="text-sm text-gray-400">Loading repository...</span>
        </div>
      )}
      <Breadcrumb items={breadcrumbItems} />
    </div>
  );
}