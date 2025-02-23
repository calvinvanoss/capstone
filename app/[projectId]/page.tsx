import Editor from '@/components/yoopta/editor';
import { getContent } from '@/lib/server-actions';
import { documentSchema } from '@/types/project';

export default async function ProjectHomePage({
  params,
}: {
  params: { projectId: string };
}) {
  const document = await getContent(params.projectId);

  if (!document) {
    return <div>Document not found</div>;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className={'flex-1 overflow-y-auto p-8'}>
        <Editor slugs={[]} document={documentSchema.parse(document)} />
      </div>
    </div>
  );
}
