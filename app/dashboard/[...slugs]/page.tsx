import { ProjectContent } from '@/components/project-content';

export default function ProjectDefaultPage({
  params,
}: {
  params: { id: string };
}) {
  return <ProjectContent path={'/'} projectId={params.id as string} />;
}
