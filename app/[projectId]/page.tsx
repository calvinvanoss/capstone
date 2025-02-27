import Editor from '@/components/yoopta/editor';
import { getDocument } from '@/lib/server-actions';
import { documentSchema } from '@/types/project';

export default async function ProjectHomePage({
  params,
}: {
  params: { projectId: string };
}) {
  // Next.js will continually call this route with favicon.ico as the projectId for some reason...
  if (params.projectId === 'favicon.ico') {
    return null;
  }

  const document = await getDocument(parseInt(params.projectId));

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
