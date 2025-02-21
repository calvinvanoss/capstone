import { ProjectHeader } from '@/components/project-header';
import { ProjectSidebar } from '@/components/project-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import React from 'react';
import DndWrapper from '@/components/dnd-wrapper';
import { projectSchema } from '@/types/project';
import { getProject } from '@/lib/server-actions';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slugs: string[] };
}) {
  const project = projectSchema.parse(await getProject(params.slugs[0]));
  const slugs = params.slugs;

  /*
  const mockProject = {
    id: params.slugs[0],
    name: 'mockProj',
    content: 'mockprojcontent',
    createdAt: '2021-10-10',
    updatedAt: '2021-10-10',
    description: 'mockprojdesc',
    tabs: [
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
  */

  return (
    <DndWrapper>
      <div className="flex flex-col min-h-screen">
        <ProjectHeader project={project} slugs={slugs} />
        <div className="flex flex-1 overflow-hidden">
          <ProjectSidebar project={project} slugs={slugs} />
          <main className={'flex-1 overflow-y-auto p-8'}>
            <Breadcrumbs project={project} slugs={slugs} />
            {children}
          </main>
        </div>
      </div>
    </DndWrapper>
  );
}
