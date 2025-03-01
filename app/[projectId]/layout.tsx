import { ProjectHeader } from '@/components/project-header';
import React from 'react';
import { projectVersionSchema } from '@/lib/types';
import { getVersion } from '@/lib/server-actions';
import { ProjectProvider } from '@/components/project-provider';
import { auth, signIn } from '@/auth';

export default async function ProjectHomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const session = await auth();
  if (!session) await signIn();

  // Next.js will continually call this route with favicon.ico as the projectId for some reason...
  if (params.projectId === 'favicon.ico') {
    return null;
  }
  const project = await getVersion(parseInt(params.projectId));

  return (
    <ProjectProvider project={projectVersionSchema.parse(project)}>
      <div className="flex flex-col min-h-screen">
        <ProjectHeader />
        {children}
      </div>
    </ProjectProvider>
  );
}
