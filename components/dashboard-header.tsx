'use client';

import { Button } from '@/components/ui/button';
import { NewProjectModal } from './new-project-modal';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DashboardHeader() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    router.push('/auth');
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <NewProjectModal />
      </div>
      <div className="flex items-center space-x-4">
        <span>user.username</span>
        <Button onClick={handleSignOut} disabled={isLoading}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
