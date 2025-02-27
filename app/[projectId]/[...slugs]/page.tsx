import Editor from '@/components/yoopta/editor';
import { getDocument } from '@/lib/server-actions';
import { documentSchema } from '@/types/project';

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string; slugs: string[] };
}) {
  const document = await getDocument(
    parseInt(params.projectId),
    params.slugs.join('/')
  );

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <Editor slugs={params.slugs} document={documentSchema.parse(document)} />
  );
}
