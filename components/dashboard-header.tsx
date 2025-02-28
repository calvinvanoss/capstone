import { Button } from '@/components/ui/button';
import { NewProjectModal } from './new-project-modal';
import { signOut } from '@/auth';

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <NewProjectModal />
      </div>
      <div className="flex items-center space-x-4">
        <span>user.username</span>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <Button type="submit">Sign Out</Button>
        </form>
      </div>
    </div>
  );
}
