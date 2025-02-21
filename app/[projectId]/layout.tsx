import { ProjectHeader } from '@/components/project-header';
import React from 'react';
import DndWrapper from '@/components/dnd-wrapper';
import { projectSchema } from '@/types/project';
import { getProject } from '@/lib/server-actions';

export default async function ProjectHomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const project = projectSchema.parse(await getProject(params.projectId));

  return (
    <DndWrapper>
      <div className="flex flex-col min-h-screen">
        <ProjectHeader project={project} />
        {children}
      </div>
    </DndWrapper>
  );
}
