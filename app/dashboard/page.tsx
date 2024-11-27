'use client';

import { DashboardHeader } from '@/components/dashboard-header';
import { ProjectList } from '@/components/project-list';

export default function DashboardPage() {
  const user = {
    name: 'John Doe',
    image: '/placeholder.svg?height=32&width=32',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} />
      <ProjectList />
    </div>
  );
}
