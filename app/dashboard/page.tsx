import { auth, signIn } from '@/auth';
import { DashboardHeader } from '@/components/dashboard-header';
import { ProjectList } from '@/components/project-list';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) await signIn();

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      <ProjectList />
    </div>
  );
}
