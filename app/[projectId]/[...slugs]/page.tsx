import Editor from '@/components/yoopta/editor';
import { getContent } from '@/lib/server-actions';
import { documentSchema } from '@/types/project';

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string; slugs: string[] };
}) {
  const document = documentSchema.parse(
    await getContent([params.projectId, ...params.slugs].join('/'))
  );
  return (
    <Editor
      projectId={params.projectId}
      slugs={params.slugs}
      document={document}
    />
  );
}
