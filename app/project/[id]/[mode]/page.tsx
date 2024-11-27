'use client';

import { useProject } from '@/components/project-provider';
import { useParams } from 'next/navigation';
import { ProjectHome } from '@/components/project-home';

export default function ProjectHomePage() {
  const { project } = useProject();
  const params = useParams();
  const mode = params.mode as 'edit' | 'view';

  if (!project) return <div>Loading...</div>;

  return <ProjectHome mode={mode} />;
}
