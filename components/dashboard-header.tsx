import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@aws-amplify/ui-react';
import { AuthUser } from 'aws-amplify/auth';

type User = {
  name: string;
  image: string;
};

export function DashboardHeader({
  user,
  signOut,
}: {
  user: AuthUser;
  signOut: () => void;
}) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span>{user.username}</span>
        <Button onClick={signOut}>Sign out</Button>
      </div>
    </div>
  );
}
