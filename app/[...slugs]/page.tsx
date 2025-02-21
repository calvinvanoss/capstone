import Editor from '@/components/yoopta/editor';
import { getContent } from '@/lib/server-actions';
import { documentSchema } from '@/types/project';

export default async function ProjectDefaultPage({
  params,
}: {
  params: { slugs: string[] };
}) {
  const document = documentSchema.parse(
    await getContent(params.slugs.join('/'))
  );
  return <Editor document={document} />;
}
