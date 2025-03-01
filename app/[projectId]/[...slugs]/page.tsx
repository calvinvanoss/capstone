import Editor from '@/components/yoopta/editor';
import { getDocContent } from '@/lib/server-actions';
import { YooptaContentValue } from '@yoopta/editor';

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string; slugs: string[] };
}) {
  const blockContent = await getDocContent(
    parseInt(params.projectId),
    params.slugs.join('/')
  );

  if (!blockContent) {
    return <div>Document not found</div>;
  }

  return (
    <Editor
      slugs={params.slugs}
      content={blockContent.content as YooptaContentValue | undefined}
    />
  );
}
