import Editor from '@/components/yoopta/editor';

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string; slugs: string[] };
}) {
  return <Editor path={params.slugs.join('/')} />;
}
