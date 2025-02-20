import Editor from '@/components/yoopta/editor';
import { getContent, getProject } from '@/lib/server-actions';
import { projectSchema, contentSchema } from '@/types/project';

export default async function ProjectDefaultPage({
  params,
}: {
  params: { slugs: string[] };
}) {
  const project = projectSchema.parse(await getProject(params.slugs[0]));
  const content = contentSchema.parse(await getContent(project, params.slugs));
  return <Editor project={project} path={params.slugs} content={content} />;
}
