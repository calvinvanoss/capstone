'use client';

import { ProjectProvider } from '@/components/project-provider';
import { ProjectHeader } from '@/components/project-header';
import { ProjectSidebar } from '@/components/project-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import React from 'react';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const pathname = usePathname();
  const [activeTabId, ...rest] = pathname.split('/').slice(3);
  const activePath = rest.join('/');
  //const [isEditing, setIsEditing] = useState(false)

  const showSidebar = activeTabId !== undefined && activeTabId !== '';

  return (
    <ProjectProvider projectId={params.id}>
      <div className="flex flex-col min-h-screen">
        <ProjectHeader activeTabId={activeTabId || ''} />
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
            <ProjectSidebar activeTabId={activeTabId} activePath={activePath} />
          )}
          <main
            className={`flex-1 overflow-y-auto ${showSidebar ? 'p-8' : 'pt-8 px-8'}`}
          >
            {showSidebar && (
              <Breadcrumbs activeTabId={activeTabId || ''} path={activePath} />
            )}
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement<any>)
                : child
            )}
          </main>
        </div>
      </div>
    </ProjectProvider>
  );
}
