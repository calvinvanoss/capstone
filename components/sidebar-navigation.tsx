'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const pages = [
  {
    title: 'Introduction',
    slug: 'introduction',
    children: [
      {
        title: 'Getting Started',
        slug: 'getting-started',
        children: [{ title: 'Quick Start', slug: 'quick-start' }],
      },
      {
        title: 'Installation',
        slug: 'installation',
        children: [
          {
            title: 'Windows',
            slug: 'windows',
          },
          {
            title: 'macOS',
            slug: 'macos',
          },
          {
            title: 'Linux',
            slug: 'linux',
            children: [
              {
                title: 'Ubuntu',
                slug: 'ubuntu',
              },
              {
                title: 'Fedora',
                slug: 'fedora',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Features',
    slug: 'features',
    children: [
      {
        title: 'Feature 1',
        slug: 'feature-1',
      },
      {
        title: 'Feature 2',
        slug: 'feature-2',
      },
    ],
  },
  {
    title: 'API Reference',
    slug: 'api-reference',
  },
];

type PageItem = {
  title: string;
  slug: string;
  children?: PageItem[];
};

const NestedNavigation: React.FC<{
  items: PageItem[];
  depth?: number;
  basePath?: string;
}> = ({ items, depth = 0, basePath = '/docs' }) => {
  const pathname = usePathname();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (slug: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slug)) {
        newSet.delete(slug);
      } else {
        newSet.add(slug);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const findExpandedFolders = (
      items: PageItem[],
      currentPath: string,
      expandedSlugs: Set<string>,
      currentBasePath: string = basePath
    ) => {
      for (const item of items) {
        const itemPath = `${currentBasePath}/${item.slug}`;
        if (currentPath.startsWith(itemPath) && item.children) {
          expandedSlugs.add(item.slug);
          findExpandedFolders(
            item.children,
            currentPath,
            expandedSlugs,
            itemPath
          );
        }
      }
    };
    const expandedSlugs = new Set<string>();
    findExpandedFolders(items, pathname, expandedSlugs);
    setExpandedFolders(expandedSlugs);
  }, [pathname, items, basePath]);

  return (
    <ul className={cn('space-y-1', depth > 0 && 'ml-4')}>
      {items.map((item) => {
        const currentSlug = `${basePath}/${item.slug}`;
        const isActive = pathname === currentSlug;
        const isExpanded = expandedFolders.has(item.slug);
        return (
          <li key={item.slug}>
            <div className="flex items-center">
              <Button
                variant="ghost"
                className={cn(
                  'flex-grow justify-start',
                  isActive && 'bg-accent'
                )}
                asChild
              >
                <Link href={currentSlug}>{item.title}</Link>
              </Button>
              {item.children && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleFolder(item.slug)}
                >
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </Button>
              )}
            </div>
            {item.children && isExpanded && (
              <NestedNavigation
                items={item.children}
                depth={depth + 1}
                basePath={currentSlug}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export function SidebarNavigation() {
  return <NestedNavigation items={pages} />;
}
