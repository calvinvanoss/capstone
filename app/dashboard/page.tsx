import { DashboardHeader } from '@/components/dashboard-header';
import { ProjectList } from '@/components/project-list';

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader />
      <ProjectList />
    </div>
  );
}
