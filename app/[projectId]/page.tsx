import Editor from '@/components/yoopta/editor';

export default async function ProjectHomePage({
  params,
}: {
  params: { projectId: string };
}) {
  // Next.js will continually call this route with favicon.ico as the projectId for some reason...
  if (params.projectId === 'favicon.ico') {
    return null;
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className={'flex-1 overflow-y-auto p-8'}>
        <Editor path={''} />
      </div>
    </div>
  );
}
