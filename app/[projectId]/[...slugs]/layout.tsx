import { ProjectSidebar } from '@/components/project-sidebar';
import { Breadcrumbs } from '@/components/breadcrumbs';
import React from 'react';
import { projectSchema } from '@/types/project';
import { getProject } from '@/lib/server-actions';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string; slugs: string[] };
}) {
  const project = projectSchema.parse(await getProject(params.projectId));
  const slugs = params.slugs;

  return (
    <div className="flex flex-1 overflow-hidden">
      <ProjectSidebar project={project} slugs={slugs} />
      <main className={'flex-1 overflow-y-auto p-8'}>
        <Breadcrumbs project={project} slugs={slugs} />
        {children}
      </main>
    </div>
  );
}
