import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useProject } from './project-provider';
import { useParams } from 'next/navigation';

type BreadcrumbsProps = {
  activeTabId: string;
  path: string;
};

export function Breadcrumbs({ activeTabId, path }: BreadcrumbsProps) {
  const { project } = useProject();
  const params = useParams();

  if (!project) return null;

  const activeTab = project.tabs.find((tab) => tab.id === activeTabId);
  if (!activeTab) return null;

  const pathParts = path.split('/').filter(Boolean);
  const breadcrumbs = [
    { name: activeTab.name, href: `/project/${params.id}/${activeTab.id}` },
    ...pathParts.map((part, index) => ({
      name: part.replace(/-/g, ' '),
      href: `/project/${params.id}/${activeTab.id}/${pathParts.slice(0, index + 1).join('/')}`,
    })),
  ];

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="inline-flex items-center">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            )}
            <Link
              href={crumb.href}
              className={`inline-flex items-center text-sm font-medium ${
                index === 0
                  ? 'text-xl font-bold' // Increase text size for the first item
                  : index === breadcrumbs.length - 1
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {crumb.name}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
