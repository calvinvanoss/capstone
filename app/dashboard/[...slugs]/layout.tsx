import { ProjectHeader } from '@/components/project-header';
import { ProjectSidebar } from '@/components/project-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import React from 'react';
import DndWrapper from '@/components/dnd-wrapper';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slugs: string[] };
}) {
  const projectId = params.slugs[0];
  const activeTabId = params.slugs[1] || null;
  const activePath = params.slugs.slice(2).join('/') || '';

  const showSidebar = activeTabId !== null;

  console.log('params:', params);

  const mockProject = {
    id: projectId,
    name: 'mockProj',
    content: 'mockprojcontent',
    structure: [
      {
        id: 'mock-tab-1',
        name: 'mock tab 1',
        content: 'mocktab1content',
        children: [
          {
            id: '1.1',
            name: '1.1',
            content: '1.1content',
            children: [{ id: '1.1.1', name: '1.1.1', content: '1.1.1content' }],
          },
          { id: '1.2', name: '1.2', content: '1.2content' },
        ],
      },
    ],
  };

  return (
    <DndWrapper>
      <div className="flex flex-col min-h-screen">
        <ProjectHeader project={mockProject} activeTabId={activeTabId || ''} />
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
            <ProjectSidebar
              project={mockProject}
              activeTabId={activeTabId}
              activePath={activePath}
            />
          )}
          <main
            className={`flex-1 overflow-y-auto ${showSidebar ? 'p-8' : 'pt-8 px-8'}`}
          >
            {showSidebar && (
              <Breadcrumbs
                project={mockProject}
                activeTabId={activeTabId || ''}
                path={activePath}
              />
            )}
            {children}
          </main>
        </div>
      </div>
    </DndWrapper>
  );
}
