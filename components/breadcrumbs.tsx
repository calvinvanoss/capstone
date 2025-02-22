'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useProjectStore } from '@/lib/zustand/store';

export function Breadcrumbs({ slugs }: { slugs: string[] }) {
  const { project } = useProjectStore();
  if (!project) return null;

  // TODO: cleanup this type check for graceful error handling
  let currentNode = project.structure.find((tab) => tab.slug === slugs[0])!;
  let href = `/${project.id}/${currentNode.slug}`;
  const breadcrumbs = [{ name: currentNode.name, href }];
  for (const slug of slugs.slice(1)) {
    currentNode = currentNode.children!.find((child) => child.slug === slug)!;
    href += `/${currentNode.slug}`;
    breadcrumbs.push({
      name: currentNode.name,
      href,
    });
  }

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            {index != 0 && index === breadcrumbs.length - 1 ? (
              <span className="text-primary">{crumb.name}</span>
            ) : (
              <Link
                href={crumb.href}
                className={`inline-flex items-center text-sm font-medium ${
                  index === 0
                    ? 'text-xl font-bold' // Increase text size for the first item
                    : 'text-muted-foreground hover:text-primary'
                }`}
              >
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
