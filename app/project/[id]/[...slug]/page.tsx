'use client';

import { useProject } from '@/components/project-provider';
import { ProjectContent } from '@/components/project-content';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
  const { project } = useProject();
  const params = useParams();
  const slug = (params.slug as string[]).join('/');

  if (!project) return <div>Loading...</div>;

  return <ProjectContent path={slug} />;
}
