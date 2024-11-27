import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type User = {
  name: string;
  image: string;
};

export function DashboardHeader({ user }: { user: User }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span>{user.name}</span>
        <Avatar>
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
