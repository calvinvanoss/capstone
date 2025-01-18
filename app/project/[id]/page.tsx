'use client';

import { ProjectProvider } from '@/components/project-provider';
import { ProjectContent } from '@/components/project-content';
import { useParams } from 'next/navigation';

export default function ProjectDefaultPage() {
  const params = useParams();

  return (
    <ProjectProvider projectId={params.id as string}>
      <ProjectContent path={'/'} />
    </ProjectProvider>
  );
}
