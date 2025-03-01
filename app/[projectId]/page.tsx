import Editor from '@/components/yoopta/editor';
import { getDocContent } from '@/lib/server-actions';
import { YooptaContentValue } from '@yoopta/editor';

export default async function ProjectHomePage({
  params,
}: {
  params: { projectId: string };
}) {
  // Next.js will continually call this route with favicon.ico as the projectId for some reason...
  if (params.projectId === 'favicon.ico') {
    return null;
  }

  const blockContent = await getDocContent(parseInt(params.projectId));

  if (!blockContent) {
    return <div>Document not found</div>;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className={'flex-1 overflow-y-auto p-8'}>
        <Editor
          slugs={[]}
          content={blockContent.content as YooptaContentValue | undefined}
        />
      </div>
    </div>
  );
}
