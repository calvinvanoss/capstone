'use client';

import { ProjectProvider } from '@/components/project-provider';
import { ProjectHeader } from '@/components/project-header';
import { ProjectSidebar } from '@/components/project-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { usePathname } from 'next/navigation';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pathname = usePathname();
  const [mode, activeTabId, ...rest] = pathname.split('/').slice(3);
  const activePath = rest.join('/');

  const showSidebar = activeTabId !== undefined && activeTabId !== '';

  return (
    <ProjectProvider projectId={params.id}>
      <div className="flex flex-col h-screen">
        <ProjectHeader
          mode={(mode as 'edit' | 'view') || 'view'}
          activeTabId={activeTabId || ''}
        />
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
            <ProjectSidebar
              mode={(mode as 'edit' | 'view') || 'view'}
              activeTabId={activeTabId}
              activePath={activePath}
            />
          )}
          <main
            className={`flex-1 overflow-y-auto ${showSidebar ? 'p-8' : 'pt-8 px-8'}`}
          >
            {showSidebar && (
              <Breadcrumbs
                mode={(mode as 'edit' | 'view') || 'view'}
                activeTabId={activeTabId || ''}
                path={activePath}
              />
            )}
            {children}
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}
