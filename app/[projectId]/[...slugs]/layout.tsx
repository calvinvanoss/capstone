import { ProjectSidebar } from '@/components/project-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import React from 'react';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string; slugs: string[] };
}) {
  const slugs = params.slugs;

  return (
    <div className="flex flex-1 overflow-hidden">
      <ProjectSidebar slugs={slugs} />
      <main className={'flex-1 overflow-y-auto p-8'}>
        <Breadcrumbs slugs={slugs} />
        {children}
      </main>
    </div>
  );
}
