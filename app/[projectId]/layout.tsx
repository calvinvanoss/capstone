import { ProjectHeader } from '@/components/project-header';
import React from 'react';
import DndWrapper from '@/components/dnd-wrapper';
import { projectSchema } from '@/types/project';
import { getProject } from '@/lib/server-actions';
import { ProjectProvider } from '@/components/project-provider';

export default async function ProjectHomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  // Next.js will continually call this route with favicon.ico as the projectId for some reason...
  if (params.projectId === 'favicon.ico') {
    return null;
  }
  const project = await getProject(parseInt(params.projectId));

  return (
    <DndWrapper>
      <ProjectProvider project={projectSchema.parse(project)}>
        <div className="flex flex-col min-h-screen">
          <ProjectHeader />
          {children}
        </div>
      </ProjectProvider>
    </DndWrapper>
  );
}
