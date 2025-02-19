import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Project, Doc } from '@/types/project';

export function Breadcrumbs({
  project,
  path,
}: {
  project: Project;
  path: string[];
}) {
  let currentNode: Doc | undefined;
  let href = `/dashboard/${project.id}`;
  const breadcrumbs = path.map(
    (part, index) => (
      (currentNode = currentNode
        ? currentNode.children!.find((child) => child.id === part)
        : project.tabs.find((tab) => tab.id === part)),
      (href = `${href}/${part}`),
      {
        name: currentNode?.name,
        href: `/dashboard/${project.id}/${path.slice(0, index + 1).join('/')}`,
      }
    )
  );

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
