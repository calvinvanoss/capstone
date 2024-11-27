'use client';

import { useProject } from '@/components/project-provider';
import { ProjectHome } from '@/components/project-home';

export default function ProjectPage() {
  const { project } = useProject();

  if (!project) return <div>Loading...</div>;

  return <ProjectHome mode="view" />;
}
